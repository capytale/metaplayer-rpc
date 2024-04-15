import { createContractSlot, type ContractSlot } from './contract-slot';
import { createFactory, type Factory } from './factory';
import type { Link } from './link';

/**
 * ContractsHolder permet de gérer les contrats.
 */
export type ContractsHolder = {
    // TODO : get doit gérer un tableau de names
    /**
     * Retourne le slot de contrat associé au nom donné en le créant au besoin.
     * Si c'est une création, cela signifie que le contrat n'a pas été déclaré par une factory,
     * et dans ce cas, l'implémentation fournie sera null.
     * 
     * @param name 
     * @returns le slot de contrat associé au nom donné
     */
    get: (name: string) => ContractSlot;

    /**
     * Déclare une fabrique de contrats suite à un appel à la méthode plug.
     * 
     * @param ids un tableau d'identifiants de contrats (nom + version locale)
     * @param factory
     */
    declareFactory: (ids: { name: string, version: number }[], factory: any) => void;
}

/**
 * crée un objet ContractsHolder basé sur le Link fourni.
 * 
 * @returns un objet ContractsHolder
 */
export function createContractsHolder(link: Link): ContractsHolder {
    const _link = link;
    const _slots: Record<string, ContractSlot> = {};
    const _factories: Factory[] = [];
    let _lastDepGroup: number | undefined = undefined;
    const _nextDepGroup = () => {
        if (_lastDepGroup == null) _lastDepGroup = 0;
        else _lastDepGroup++;
        return _lastDepGroup;
    }
    const _prepareGroup: (ids: { name: string, version: number }[], areRemote: boolean) => ContractSlot[] = (ids, areRemote) => {
        const depGroup = _nextDepGroup();
        const percolGroups: boolean[] = Array(depGroup).fill(false);
        const slots = ids.map(id => {
            let slot = _slots[id.name];
            if (slot == null) {
                slot = createContractSlot(id.name);
                slot.depGroup = depGroup;
                _slots[id.name] = slot;
            } else {
                if (slot.depGroup != null) {
                    percolGroups[slot.depGroup] = true;
                }
                slot.depGroup = depGroup;
            }
            if (areRemote) {
                if (slot.remoteVersion != null) throw new Error('Remote version already set : ' + id.name);
                slot.setRemoteVersion(id.version);
            } else {
                if (slot.localVersion != null) {
                    if (slot.localVersion === 0) throw new Error('Contract "' + id.name + '" is already being used, unable to plug it now.');
                    else throw new Error('Contract "' + id.name + '" is already plugged, unable to plug it again.');
                }
                slot.setLocalVersion(id.version);
            }
            return slot;
        });
        for (const k in _slots) {
            const slot = _slots[k];
            if ((slot.depGroup != null) && (slot.depGroup !== depGroup) && percolGroups[slot.depGroup]) {
                slot.depGroup = depGroup;
            }
        }
        return slots;
    };
    _link.onDeclare = (ids) => {
        const slots = _prepareGroup(ids, true);
        _flush();
    };
    _link.onDone = () => {

    };
    _link.onProvide = (name, version, i) => {
        let slot = _slots[name];
        if (slot == null) {
            throw new Error('Contract not declared : ' + name);
        }
        slot.setInterface(i);
        _flush();
    };
    let _flushing = false;
    let _flushScheduled = false;
    const _flush = () => {
        _flushScheduled = true;
        if (_flushing) return;
        _flushing = true;
        while (_flushScheduled) {
            _flushScheduled = false;
            // flush factories declaration
            if (_link.isReady) {
                const factories = _factories.filter(factory => !factory.isDeclared);
                if (factories.length > 0) {
                    _flushScheduled = true;
                    factories.forEach(factory => {
                        factory.isDeclared = true;
                        _link.declare(factory.slots.map(slot => ({ name: slot.name, version: slot.localVersion! })));
                    });
                }
            }

            // flush factories invocation
            if (_link.isReady) {
                const factories = _factories.filter(factory => ((!factory.isDone) && factory.isReady));
                if (factories.length > 0) {
                    _flushScheduled = true;
                    factories.forEach(factory => {
                        const _interfaces = factory.invoke();
                        for (let i = 0; i < factory.slots.length; i++) {
                            const slot = factory.slots[i];
                            _link.provide(slot.name, slot.localVersion!, _interfaces[i]).then(() => {
                                slot.setRemotelyPlugged();
                            });
                        }
                    });
                }
            }

            // flush depGroups
            if (_lastDepGroup != null) {
                const depGroupState = Array(_lastDepGroup + 1).fill(null);
                for (const k in _slots) {
                    const slot = _slots[k];
                    if (slot.depGroup != null) {
                        if (depGroupState[slot.depGroup] == null) {
                            depGroupState[slot.depGroup] = slot.isReadyForActivation;
                        } else {
                            if (!slot.isReadyForActivation) {
                                depGroupState[slot.depGroup] = false;
                            }
                        }
                    }
                }
                if (depGroupState.some(v => v === true)) {
                    _flushScheduled = true;
                    for (const k in _slots) {
                        const slot = _slots[k];
                        if ((slot.depGroup != null) && depGroupState[slot.depGroup]) {
                            slot.activate();
                        }
                    }
                }
            }
        }
        _flushing = false;
    };
    return {
        // TODO
        get: (name: string) => {
            if (!(name in _slots)) {
                const slot = createContractSlot(name);
                slot.setLocalVersion(0);
                _slots[name] = slot;
            }
            return _slots[name];
        },
        declareFactory: (ids, factory) => {
            const slots = _prepareGroup(ids, false);
            const _factory = createFactory(slots, factory);
            _factories.push(_factory);
            _flush();
        }
    };
}
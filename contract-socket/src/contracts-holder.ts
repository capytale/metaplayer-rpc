import { createContractSlot, type ContractSlot } from './contract-slot';
import { createFactory, type Factory } from './factory';
import type { Link } from './link';

/**
 * ContractsHolder permet de gérer les contrats.
 */
export type ContractsHolder = {
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
     * @param deps un tableau d'identifiants de contrats dépendants (nom + version locale = 0)
     * @param factory
     */
    declareFactory: (
        ids: { name: string, version: number }[],
        deps: { name: string, version: number }[],
        factory: any) => void;

    /**
     * Informe que l'ensemble des implémentations de contrats a été fourni.
     */
    done: boolean;
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
    const _prepareGroup: (areRemote: boolean, ...args: ({ name: string, version: number }[])[]) => (ContractSlot[][]) = (areRemote, ...args) => {
        const depGroup = _nextDepGroup();
        const percolGroups: boolean[] = Array(depGroup).fill(false);
        const ret = args.map(ids => {
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
                    if (slot.remoteVersion == null) {
                        slot.setRemoteVersion(id.version);
                        // if (id.version === 0) slot.setRemoteInterface(null);
                    } else {
                        if (slot.remoteVersion !== id.version) {
                            throw new Error('Remote contract "' + id.name + '" has already been declared with different version.');
                        }
                    }
                } else {
                    if (slot.localVersion == null) {
                        slot.setLocalVersion(id.version);
                    } else {
                        if ((id.version !== 0) && (slot.localVersion !== id.version)) {
                            if (slot.localVersion === 0) throw new Error('Remote contract "' + id.name + '" has already been used without providing local implementation, unable to implement it now.');
                            else throw new Error('Local contract "' + id.name + '" is already implemented, unable to implement it again.');
                        }
                    }
                }
                return slot;
            });
            return slots;
        });
        for (const k in _slots) {
            const slot = _slots[k];
            if ((slot.depGroup != null) && (slot.depGroup !== depGroup) && percolGroups[slot.depGroup]) {
                slot.depGroup = depGroup;
            }
        }
        return ret;
    };

    _link.onDeclare = (ids) => {
        _prepareGroup(true, ids);
        _flush();
    };
    _link.onDone = () => {
        if (_remoteDone) return;
        _remoteDone = true;
        _flush();
    };
    _link.onProvide = (name, version, i) => {
        let slot = _slots[name];
        if (slot == null) {
            throw new Error('Contract not declared : ' + name);
        }
        slot.setRemoteInterface(i);
        _flush();
    };
    let _flushing = false;
    let _flushScheduled = false;
    let _localDone = false;
    let _remoteDone = false;
    const _flush = async () => {
        _flushScheduled = true;
        if (_flushing) return;
        _flushing = true;
        while (_flushScheduled) {
            _flushScheduled = false;
            // flush pendings slots
            if (_link.isReady) {
                if (_localDone || _remoteDone) {
                    Object.values(_slots).forEach(slot => {
                        if (_localDone) slot.localDone();
                        if (_remoteDone) slot.remoteDone();
                    });
                }
            }
            // flush factories declaration
            if (_link.isReady) {
                const factories = _factories.filter(factory => !factory.isDeclared);
                if (factories.length > 0) {
                    _flushScheduled = true;
                    for (const factory of factories) {
                        factory.isDeclared = true;
                        const slots: ContractSlot[] = Array(factory.args.length + factory.deps.length);
                        factory.args.forEach((slot, i) => slots[i] = slot);
                        factory.deps.forEach((slot, i) => slots[i + factory.args.length] = slot);
                        await _link.declare(slots.map(slot => ({ name: slot.name, version: slot.localVersion! })));
                        slots.forEach(slot => slot.localVersionNotified = true);
                    }
                }
            }

            // flush slots declaration
            if (_link.isReady) {
                const slots = Object.values(_slots).filter(slot => ((!slot.localVersionNotified) && (slot.localVersion != null)));
                if (slots.length > 0) {
                    _flushScheduled = true;
                    for (const slot of slots) {
                        await _link.declare([{ name: slot.name, version: slot.localVersion! }]);
                        slot.localVersionNotified = true;
                    }
                }
            }

            // flush factories invocation
            if (_link.isReady) {
                const factories = _factories.filter(factory => ((!factory.isDone) && factory.isReady));
                if (factories.length > 0) {
                    _flushScheduled = true;
                    for (const factory of factories) {
                        const _interfaces = factory.invoke();
                        for (let i = 0; i < factory.args.length; i++) {
                            const slot = factory.args[i];
                            await _link.provide(slot.name, slot.localVersion!, _interfaces[i])
                            slot.setRemotelyPlugged();
                        }
                    }
                }
            }

            // flush depGroups
            if (_lastDepGroup != null) {
                const depGroupState = Array(_lastDepGroup + 1).fill(null);
                for (const k in _slots) {
                    const slot = _slots[k];
                    if (slot.depGroup != null) {
                        if (!slot.isReadyForActivation) {
                            depGroupState[slot.depGroup] = false;
                        } else {
                            if ((depGroupState[slot.depGroup] == null) && (!slot.isActivated)) {
                                depGroupState[slot.depGroup] = true;
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
        if (_localDone && _link.isReady) {
            _link.done();
        }
    };
    return {
        get: (name: string) => {
            if (!(name in _slots)) {
                const slot = createContractSlot(name);
                slot.setLocalVersion(0);
                _slots[name] = slot;
            }
            _flush();
            return _slots[name];
        },
        declareFactory: (ids, deps, factory) => {
            if (_localDone) throw new Error('Cannot declare a factory after done has been set to true.');
            const [slots, depSlots] = _prepareGroup(false, ids, deps);
            const _factory = createFactory(slots, depSlots, factory);
            _factories.push(_factory);
            _flush();
        },
        get done() {
            return _localDone;
        },
        set done(v) {
            if (_localDone) {
                if (!v) throw new Error('Cannot set done to false after it has been set to true.');
            } else {
                if (v) {
                    _localDone = true;
                    _flush();
                }
            }
        }
    };
}
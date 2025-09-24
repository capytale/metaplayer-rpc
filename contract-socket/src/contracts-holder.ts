import { createContractSlot, type ContractSlot } from './contract-slot';
import { createFactory, type Factory } from './factory';
import { createCallback, type Callback } from './callback';
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
     * @param deps un tableau de noms de contrats
     * @param factory
     */
    declareFactory: (
        ids: { name: string, version: number }[],
        deps: string[],
        factory: any) => void;

    /**
     * Déclare une fonction utilisatrice de contrats suite à un appel à la méthode use.
     * 
     * @param deps un tableau de noms de contrats
     * @param factory
     */
    declareCallback: (
        names: string[],
        func: any) => void;

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
    let _callbacks: Callback[] = [];
    let _lastDepGroup: number | undefined = undefined;
    const _nextDepGroup = () => {
        if (_lastDepGroup == null) _lastDepGroup = 0;
        else _lastDepGroup++;
        return _lastDepGroup;
    }
    function _getSlot(name: string): ContractSlot {
        let slot = _slots[name];
        if (slot == null) {
            slot = createContractSlot(name);
            if (slot.localVersion == null) {
                if (_localDone) slot.localVersion = 0;
                if (_localDoneNotified) slot.localVersionSent = true;
            }
            if (slot.remoteVersion == null) {
                if (_remoteDone) slot.remoteVersion = 0;
            }
            _slots[name] = slot;
        }
        return slot;
    }
    function _getSlots(names: string[]): ContractSlot[] {
        return names.map(_getSlot);
    }
    function _declareGroup(...args: ContractSlot[][]): void {
        const depGroup = _nextDepGroup();
        const percolGroups: boolean[] = Array(depGroup).fill(false);
        args.forEach(slots => {
            slots.forEach(slot => {
                if (slot.depGroup != null) {
                    percolGroups[slot.depGroup] = true;
                }
                slot.depGroup = depGroup;
            });
        });
        Object.values(_slots).forEach(slot => {
            if ((slot.depGroup != null) && (slot.depGroup !== depGroup) && percolGroups[slot.depGroup]) {
                slot.depGroup = depGroup;
            }
        });
    };


    _link.onDeclare = (ids) => {
        const slots = _getSlots(ids.map(id => id.name));
        for (let i = 0; i < ids.length; i++) {
            if (ids[i].version != null) slots[i].remoteVersion = ids[i].version;
        }
        _declareGroup(slots);
        _flush();
    };
    _link.onDone = () => {
        if (_remoteDone) return;
        _remoteDone = true;
        Object.values(_slots).forEach(slot => {
            if (slot.remoteVersion == null) slot.remoteVersion = 0;
        });
        _flush();
    };
    _link.onProvide = (name, version, i) => {
        let slot = _slots[name];
        if (slot == null) {
            throw new Error(`Contract not declared : ${name}`);
        }
        if (slot.remoteVersion != version) {
            throw new Error(`Remote declared version ${slot.remoteVersion} of contract "${name}" but provided version ${version}.`);
        }
        if (slot.remoteInterfaceReceived) {
            throw new Error(`Remote contract "${name}" is already provided.`);
        }
        slot.setRemoteInterface(i);
        _flush();
    };
    let _flushing = false;
    let _flushScheduled = false;
    let _localDone = false;
    let _localDoneNotified = false;
    let _remoteDone = false;
    async function _flush() {
        _flushScheduled = true;
        if (_flushing) return;
        _flushing = true;
        while (_flushScheduled) {
            _flushScheduled = false;
            // flush factories declaration
            if (_link.isReady) {
                const factories = _factories.filter(factory => !factory.isDeclared);
                if (factories.length > 0) {
                    for (const factory of factories) {
                        const slots: ContractSlot[] = Array(factory.args.length + factory.deps.length);
                        factory.args.forEach((slot, i) => slots[i] = slot);
                        factory.deps.forEach((slot, i) => slots[i + factory.args.length] = slot);
                        await _link.declare(slots.map(slot => ({ name: slot.name, version: slot.localVersion })));
                        slots.forEach(slot => {
                            if (slot.localVersion != null) slot.localVersionSent = true;
                        });
                        factory.isDeclared = true;
                    }
                }
            }

            // flush slots declaration and notify done
            if (_link.isReady) {
                if (_localDone && _factories.every(factory => factory.isDeclared)) {
                    const slots = Object.values(_slots).filter(slot => ((!slot.localVersionSent) && (slot.localVersion != null)));
                    if (slots.length > 0) {
                        for (const slot of slots) {
                            await _link.declare([{ name: slot.name, version: slot.localVersion }]);
                            slot.localVersionSent = true;
                        }
                    }
                    if (!_localDoneNotified) {
                        _localDoneNotified = true;
                        await _link.done();
                    }
                }
            }

            // flush factories invocation
            if (_link.isReady) {
                const factories = _factories.filter(factory => ((!factory.isDone) && factory.isReady));
                if (factories.length > 0) {
                    for (const factory of factories) {
                        const _interfaces = factory.invoke();
                        for (let i = 0; i < factory.args.length; i++) {
                            const slot = factory.args[i];
                            await _link.provide(slot.name, slot.localVersion!, _interfaces[i])
                            slot.localInterfaceSent = true;
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
                        if (!slot.isActivable) {
                            depGroupState[slot.depGroup] = false;
                        } else {
                            if ((depGroupState[slot.depGroup] == null) && (!slot.isActivated)) {
                                depGroupState[slot.depGroup] = true;
                            }
                        }
                    }
                }
                if (depGroupState.some(v => v === true)) {
                    for (const k in _slots) {
                        const slot = _slots[k];
                        if ((slot.depGroup != null) && depGroupState[slot.depGroup]) {
                            slot.activate();
                        }
                    }
                }
            }
            // flush callbacks
            if (_link.isReady) {
                const callbacks = _callbacks;
                _callbacks = [];
                const noDone: Callback[] = [];
                for (const cb of callbacks) {
                    if (!cb.isDone && cb.isReady) {
                        cb.invoke();
                    } else {
                        noDone.push(cb);
                    }
                }
                noDone.push(..._callbacks);
                _callbacks = noDone;
            }
        }
        _flushing = false;
    };
    return {
        get(name: string) {
            return _getSlot(name);
        },
        declareFactory: (ids, deps, factory) => {
            if (_localDone) throw new Error('Cannot declare a factory after done has been set to true.');
            const slots = _getSlots(ids.map(id => id.name));
            {
                const pbSlots = slots.filter(slot => slot.localVersion != null);
                if (pbSlots.length > 0) {
                    throw new Error('Cannot declare a factory for already implemented contracts : ' + pbSlots.map(slot => slot.name).join(', '));
                }
            }
            for (let i = 0; i < ids.length; i++) {
                slots[i].localVersion = ids[i].version;
            }
            const depSlots = _getSlots(deps);
            _declareGroup(slots, depSlots);
            const _factory = createFactory(slots, depSlots, factory);
            _factories.push(_factory);
            _flush();
        },
        declareCallback(names, func) {
            const slots = _getSlots(names);
            const _cb = createCallback(slots, func);
            _callbacks.push(_cb);
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
                    Object.values(_slots).forEach(slot => {
                        if (slot.localVersion == null) slot.localVersion = 0;
                    });
                    _flush();
                }
            }
        }
    };
}
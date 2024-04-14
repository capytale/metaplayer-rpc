import type { ContractSlot } from './contract-slot';

export type Factory = {
    /**
     * Indique si la fabrique a été déclarée.
     */
    isDeclared: boolean;

    /**
     * Indique si la fabrique est prête à être invoquée.
     */
    readonly isReady: boolean;

    /**
     * Indique si la fabrique a été invoquée.
     */
    readonly isDone: boolean;

    /**
     * Exécute la fabrique.
     * 
     * @returns le tableau des interfaces implémentées par la fabrique
     */
    invoke: () => any[];

    readonly slots: ReadonlyArray<ContractSlot>;
};

export function createFactory(slots: ContractSlot[], factory: any): Factory {
    const _slots = slots;
    const _factory = factory;
    let _done = false;
    return {
        isDeclared: false,
        get isReady() {
            return _slots.every(slot => slot.isReadyForFactory);
        },
        get isDone() {
            return _done;
        },
        get slots() {
            return _slots;
        },
        invoke() {
            if (_done) {
                throw new Error('Factory already invoked');
            }
            if (!this.isReady) {
                throw new Error('Factory is not ready');
            }
            _done = true;
            const remotes = _slots.map(slot => slot.getRemote());
            const _interfaces = _factory(remotes);
            if (_interfaces.length != _slots.length) {
                throw new Error('Invalid factory result');
            }
            return _interfaces;
        }
    };
}
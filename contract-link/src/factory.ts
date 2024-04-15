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

    /**
     * Les arguments de la fabrique.
     */
    readonly args: ReadonlyArray<ContractSlot>;

    /**
     * Les dépendances de la fabrique qui ne sont pas implémentée par elle.
     */
    readonly deps: ReadonlyArray<ContractSlot>;
};

export function createFactory(args: ContractSlot[], deps: ContractSlot[], factory: any): Factory {
    const _args: ContractSlot[] = args;
    const _deps: ContractSlot[] = deps;
    let _factory = factory;
    let _done = false;
    return {
        isDeclared: false,
        get isReady() {
            const ready = _args.every(slot => slot.isReadyForFactory);
            if (!ready) return false;
            return _deps.every(slot => slot.isReadyForFactory);
        },
        get isDone() {
            return _done;
        },
        get args() {
            return _args;
        },
        get deps() {
            return _deps;
        },
        invoke() {
            if (_done) {
                throw new Error('Factory already invoked');
            }
            if (!this.isReady) {
                throw new Error('Factory is not ready');
            }
            const remotes = _args.map(slot => slot.getRemote());
            let _interfaces: any;
            if (_deps.length > 0) {
                const depRemotes = _deps.map(slot => slot.getRemote());
                _interfaces = _factory(remotes, depRemotes);
            } else {
                _interfaces = _factory(remotes);
            }
            
            if (_interfaces.length != _args.length) {
                throw new Error('Invalid factory result');
            }
            _done = true;
            _factory = null;
            return _interfaces;
        }
    };
}
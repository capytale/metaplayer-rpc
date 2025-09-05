import type { ContractSlot } from './contract-slot';

export type Callback = {
    /**
     * Indique si la callback est prête à être invoquée.
     */
    readonly isReady: boolean;

    /**
     * Indique si la callback a été invoquée.
     */
    readonly isDone: boolean;

    /**
     * Exécute la callback.
     */
    invoke: () => void;

    /**
     * Les arguments de la callback.
     */
    readonly args: ReadonlyArray<ContractSlot>;
};

export function createCallback(args: ContractSlot[], func: any): Callback {
    const _args: ContractSlot[] = args;
    let _func = func;
    let _done = false;
    return {
        get isReady() {
            return _args.every(slot => slot.isActivated);
        },
        get isDone() {
            return _done;
        },
        get args() {
            return _args;
        },
        invoke() {
            if (_done) {
                throw new Error('callback already invoked');
            }
            if (!this.isReady) {
                throw new Error('callback is not ready');
            }
            const remotes = _args.map(slot => slot.getRemote());
            _func(remotes);
            _done = true;
        }
    };
}
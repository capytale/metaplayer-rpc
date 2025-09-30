import type { ContractSlot } from './contract-slot';
import type { PM } from './prefix-message';

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

export function callbackFactory(pm: PM) {
    return function(args: ContractSlot[], func: any, arrayMode: boolean): Callback {
        const _args: ContractSlot[] = args;
        let _func = func;
        const _arrayMode = arrayMode;
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
                    throw new Error(pm('callback already invoked'));
                }
                if (!this.isReady) {
                    throw new Error(pm('callback is not ready'));
                }
                let remotes: any;
                if (_arrayMode) {
                    remotes = _args.map(slot => slot.getRemote());
                } else {
                    remotes = _args[0].getRemote();
                }

                _func(remotes);
                _done = true;
            }
        };
    }
}
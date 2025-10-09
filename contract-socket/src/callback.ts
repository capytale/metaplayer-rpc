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
    return function (
        args: ContractSlot[],
        func: any,
        arrayMode: boolean,
        resolvers?: [resolve: (value: any) => void,
            reject: (reason: any) => void],
    ): Callback {
        let _func = func;
        let _done = false;
        function _isReady() {
            return args.every(slot => slot.isActivated);
        }
        return {
            get isReady() {
                return _isReady();
            },
            get isDone() {
                return _done;
            },
            get args() {
                return args;
            },
            invoke() {
                if (_done || !_isReady()) {
                    const e = new Error(pm(_done ? 'callback already invoked' : 'callback parameters are not ready'));
                    resolvers?.[1](e);
                    throw e;
                }
                const remotes = arrayMode ? args.map(slot => slot.getRemote()) : args[0].getRemote();
                let result: any;
                try {
                    result = _func(remotes);
                } catch (e) {
                    if (resolvers == null) {
                        console.error(pm('error in callback:'), e);
                    } else {
                        resolvers[1](e);
                    }
                } finally {
                    _done = true;
                }
                resolvers?.[0](result);
            }
        }
    }
}
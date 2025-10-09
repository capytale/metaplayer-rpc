import type { ContractSlot } from './contract-slot';
import type { PM } from './prefix-message';

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

export function factoryFactory(pm: PM) {

    return function (
        args: ContractSlot[],
        deps: ContractSlot[],
        factory: any,
        arrayMode: boolean,
    ): Factory {
        let _factory = factory;
        let _done = false;
        let _declared = false;
        function _isReady() {
            return args.every(slot => slot.remoteVersionReceived && slot.localVersionSent)
                && deps.every(slot => slot.remoteVersionReceived);
        }
        return {
            get isDeclared() {
                return _declared;
            },
            set isDeclared(v) {
                if (!v && _declared) {
                    throw new Error(pm('Factory already declared'));
                }
                _declared = v;
            },
            get isReady() {
                return _isReady();
            },
            get isDone() {
                return _done;
            },
            get args() {
                return args;
            },
            get deps() {
                return deps;
            },
            invoke() {
                if (_done) {
                    throw new Error(pm('Factory already invoked'));
                }
                if (!_isReady()) {
                    throw new Error(pm('Factory is not ready'));
                }
                let remotes: any;
                if (arrayMode) {
                    remotes = args.map(slot => slot.getRemote());
                } else {
                    remotes = args[0].getRemote();
                }
                let _interfaces: any;
                const depRemotes: any = deps.length > 0 ? deps.map(slot => slot.getRemote()) : null;
                try {
                    _interfaces = (depRemotes == null) ? _factory(remotes) : _factory(remotes, depRemotes);
                } catch (e) {
                    throw new Error(pm('error in factory:'), { cause: e });
                }
                if (!arrayMode) {
                    _interfaces = [_interfaces];
                }
                if (_interfaces.length != args.length) {
                    throw new Error(pm('Invalid factory result'));
                }
                _done = true;
                _factory = null;
                return _interfaces;
            }
        };
    }
}
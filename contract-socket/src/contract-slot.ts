import type { PM } from './prefix-message';

/**
 * ContractSlot gère une référence à un contrat et permet de présenter un objet Remote ou LazyRemote.
 */
export type ContractSlot = {
    /**
     * Le nom du contrat.
     */
    readonly name: string;


    /**
     * La version locale du contrat implémentée par cette partie.
     */
    localVersion?: number;

    /**
     * Indique si la version locale a été notifiée à distance.
     */
    localVersionSent: boolean;

    /**
     * Indique si l'interface locale a été construite et fournie à la partie distante.
     */
    localInterfaceSent: boolean;



    /**
     * La version distante du contrat qui a été déclarée par l'autre partie. 
     */
    remoteVersion?: number;

    /**
     * Indique si la version remote est connue. 
     * Si true, alors le contrat est prêt à être fourni comme dépendance à une fonction factory.
     */
    readonly remoteVersionReceived: boolean;

    /**
     * Indique si l'interface distante a été reçue.
     * true si la version distante est 0 car dans ce
     * cas l'interface distante n'est pas attendue.
     */
    readonly remoteInterfaceReceived: boolean;

    /**
     * Le groupe de dépendances du contrat. Il s'agit d'un nombre entier positif. 
     * Les contrats d'un même groupe de dépendances doivent être activés en même temps.
     */
    depGroup?: number;

    /**
     * Ne doit être appelé qu'une seule fois dès que l'interface distante est obtenue.
     * @param i l'interface distante.
    */
    setRemoteInterface: (i: any) => void;

    /**
     * Indique si l'interface distante peut être activée.
     * C'est à dire 
     */
    readonly isActivable: boolean;

    /**
     * Indique si l'interface distante est utilisable. 
     */
    readonly isActivated: boolean;

    activate: () => void;

    /**
     * Retourne l'objet Remote associé à ce contrat en le créant si nécessaire.
     * 
     * @returns l'objet Remote associé à ce contrat
     */
    getRemote: () => any;

    /**
     * Retourne l'objet LazyRemote associé à ce contrat en le créant si nécessaire.
     * 
     * @returns l'objet LazyRemote associé à ce contrat
     */
    getLazyRemote: () => any;

    /**
     * Retourne une promesse qui sera résolue lorsque l'interface distante sera disponible.
     */
    readonly activationPromise: Promise<void>;
}

export function contractSlotFactory(pm: PM) {

    /**
     * Permet de créer un objet ContractSlot.
     * 
     * @param name le nom du contrat
     * @returns Un objet ContractSlot vide
     */
    return function (name: string): ContractSlot {
        let _localVersion: number | undefined;
        let _localVersionSent = false;
        let _localInterfaceSent = false;

        let _remoteVersion: number | undefined;
        let _interface: any;
        let _interfaceReceived = false;

        let _isActivated = false;

        /**
         * @var _remote l'objet Remote associé à ce contrat. Cet objet donne accès à la version puis à l'interface distante.
         */
        let _remote: any = undefined;
        let _lazyRemote: any = undefined;

        let _activationPromise: Promise<any> | undefined = undefined;
        let _promiseResolve: any = undefined;
        let _promiseReject: any = undefined;

        function _getInterface() {
            if (_remoteVersion == null) return undefined;
            if (_remoteVersion === 0) return undefined;
            if (_interface == null) return undefined;
            return _interface;
        };
        function _getIfVersionIs(v: number) {
            if (null == _remoteVersion) return undefined;
            if (null == _interface) return undefined;
            if (v > _remoteVersion) return undefined;
            return _interface;
        };
        function _getActivationPromise() {
            if (_activationPromise != null) return _activationPromise;
            if (_isActivated) return _activationPromise = Promise.resolve();
            return _activationPromise = new Promise((resolve, reject) => {
                _promiseResolve = resolve;
                _promiseReject = reject;
            });
        };
        function _getRemote() {
            if (_remote === undefined) {
                _remote = {
                    get name() { return name },
                    get version() { return _remoteVersion },
                    get i() { return _getInterface() },
                    v: (v: number) => _getIfVersionIs(v),
                };
            }
            return _remote;
        };
        function _getLazyRemote() {
            if (_lazyRemote === undefined) {
                _lazyRemote = {
                    get name() { return name },
                    get version() { return _isActivated ? _remoteVersion : undefined },
                    get i() { return _isActivated ? _getInterface() : undefined },
                    v: (v: number) => { return _isActivated ? _getIfVersionIs(v) : undefined },
                    get promise() {
                        if (_remoteVersion === 0) return Promise.reject(pm('Remote interface not provided'));
                        return _getActivationPromise()
                            .then(() => {
                                if (_remoteVersion === 0) throw new Error(pm('Remote interface not provided'));
                                return _getRemote();
                            });
                    }
                };
            }
            return _lazyRemote;
        };
        function _resolve() {
            if (_promiseResolve != null) {
                _promiseResolve();
                _promiseResolve = _promiseReject = undefined;
            }
        };
        function _reject(r?: any) {
            if (_promiseReject != null) {
                _promiseReject(r);
                _promiseResolve = _promiseReject = undefined;
            }
        };
        return {
            get name() { return name },
            get localVersion() {
                if (_localVersion == null) return;
                return _localVersion;
            },
            set localVersion(v: number | undefined) {
                if ((_localVersion != null) && (_localVersion !== v)) throw new Error(pm('A different local version is already set'));
                _localVersion = v;
            },
            get localVersionSent() { return _localVersionSent },
            set localVersionSent(v: boolean) {
                if ((!v) && (_localVersionSent)) throw new Error(pm('Local version already notified'));
                _localVersionSent = v;
                if (v && (_localVersion === 0)) {
                    _localInterfaceSent = true;
                }
            },
            get localInterfaceSent() {
                return _localInterfaceSent;
            },
            set localInterfaceSent(v) {
                if (_localVersion == null) throw new Error(pm('Local version not set'));
                if (!v && _localInterfaceSent) throw new Error(pm('Local interface already sent.'));
                _localInterfaceSent = v;
            },

            get remoteVersion() {
                if (_remoteVersion == null) return;
                return _remoteVersion;
            },
            set remoteVersion(v: number | undefined) {
                if ((_remoteVersion != null) && (_remoteVersion !== v)) throw new Error(pm('A different remote version is already set for ' + name + `(${_remoteVersion} -> ${v})`));
                _remoteVersion = v;
                if (v === 0) {
                    _interfaceReceived = true;
                }
            },
            get remoteVersionReceived() {
                return _remoteVersion != null;
            },
            setRemoteInterface: (i: any) => {
                if (_remoteVersion == null) throw new Error(pm('Remote version not set'));
                if (_remoteVersion === 0) {
                    console.warn(pm('Remote version is 0, remote interface is ignored.'));
                    return;
                }
                if (_interfaceReceived) throw new Error(pm('Interface already provided.'));
                _interface = i;
                _interfaceReceived = true;
            },
            get remoteInterfaceReceived() {
                return _interfaceReceived;
            },

            depGroup: undefined,

            get isActivable() { return _interfaceReceived && _localInterfaceSent },
            get isActivated() { return _isActivated },
            activate() {
                if (_isActivated) return;
                if (!_interfaceReceived) throw new Error(pm('Remote interface not provided.'));
                if (!_localInterfaceSent) throw new Error(pm('Local interface not sent'));
                _isActivated = true;
                _resolve();
            },

            getRemote: () => _getRemote(),
            getLazyRemote: () => _getLazyRemote(),
            get activationPromise() {
                return _getActivationPromise();
            }
        };
    }
}
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
    readonly localVersion?: number;

    /**
     * La version distante du contrat qui a été déclarée par l'autre partie.
     */
    readonly remoteVersion?: number;

    /**
     * Indique si le contrat est prêt à être fourni à la fonction factory qui la construit.
     * C'est à dire si la version remote est connue et que la factory n'a pas encore été appelée.
     */
    readonly isReadyForFactory: boolean;

    /**
     * Ne doit être appelée qu'une seule fois lorsque la factory a été appelée.
     */
    setFactoryDone: () => void;

    /**
     * Indique si le contrat est prêt à être fourni comme dépendance à une fonction factory.
     * C'est à dire si la version remote est connue.
     */
    readonly isReadyForFactoryDep: boolean;

    /**
     * Indique si le contrat est prêt à être activé.
     * C'est à dire si les interfaces sont branchées dans les deux sens.
     * Cependant, l'activation n'aura lieu que lorsque tous les slots du même groupe
     * de dépendances seront aussi prêts.
     */
    readonly isReadyForActivation: boolean;

    /**
     * Le groupe de dépendances du contrat. Il s'agit d'un nombre entier positif.
     * Les contrats d'un même groupe de dépendances doivent être activés en même temps.
     */
    depGroup?: number;

    /**
     * Indique si le contrat est utilisable.
     */
    readonly isActivated: boolean;

    /**
     * Doit être appelé dès que la version locale est connue.
     * 
     * @param v la version locale du contrat
     */
    setLocalVersion: (v: number) => void;

    /**
     * Indique si la version locale a été notifiée à distance.
     */
    localVersionNotified: boolean;

    /**
     * Doit être appelé dès que la version distante est connue.
     * 
     * @param v la version distante du contrat
     */
    setRemoteVersion: (v: number) => void;

    /**
     * Ne doit être appelé qu'une seule fois dès que l'interface distante est obtenue.
     * 
     * @param i l'interface distante. null ou undefined n'est accepté que si la version distante est 0.
     */
    setRemoteInterface: (i: any) => void;

    readonly hasRemoteInterface: boolean;

    /**
     * Ne doit être appelé qu'une seule fois dès que l'implémentation locale a été
     * fournie à l'autre partie et que le branchement a été confirmé.
     */
    setRemotelyPlugged: () => void;

    /**
     * Active le contrat. Peut être appelée plusieurs fois.
     */
    activate: () => void;

    /**
     * L'appel est optionnel. Il permet de signaler la fin des branchements locaux.
     * Si l'activation n'a pas eu lieu, l'interface ne sera pas fournie.
     */
    localDone: () => void;

    /**
     * L'appel est optionnel. Il permet de signaler la fin des branchements remote.
     * Si l'activation n'a pas eu lieu, l'interface ne sera pas fournie.
     */
    remoteDone: () => void;

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

/**
 * Permet de créer un objet ContractSlot.
 * 
 * @param name le nom du contrat
 * @returns Un objet ContractSlot vide
 */
export function createContractSlot(name: string): ContractSlot {
    const _name = name;
    /**
     * @var _localVersion la version locale du contrat.
     * Si la version locale est 0, alors l'interface ne sera pas fournie.
     */
    let _localVersion: number | undefined = undefined;
    /**
     * @var _localVersionNotified indique si la version locale a été notifiée à distance.
     */
    let _localVersionNotified = false;
    /**
     * @var _remoteVersion la version distante du contrat.
     * Si la version distante est 0, alors l'interface distante ne sera pas fournie.
     */
    let _remoteVersion: number | undefined = undefined;
    let _interface: any = undefined;
    /**
     * @var _factoryDone indique si la factory a été appelée.
     */
    let _factoryDone = false;
    /**
     * @var _remotelyPlugged indique si l'interface locale a été branchée à distance.
     */
    let _remotelyPlugged = false;
    //let _wontBeActivated = false;
    /**
     * @var _isActivated indique si l'interface a été activée.
     */
    let _isActivated = false;
    let _remote: any = undefined;
    let _lazyRemote: any = undefined;
    let _activationPromise: Promise<any> | undefined = undefined;
    let _promiseResolve: any = undefined;
    let _promiseReject: any = undefined;
    const _getInterface = () => {
        if (_remoteVersion == null) return undefined;
        if (_remoteVersion === 0) return undefined;
        if (_interface == null) return undefined;
        return _interface;
    };
    const _hasRemoteInterface = () => {
        if (_remoteVersion == null) return false;
        if (_remoteVersion === 0) return true;
        return _interface != null;
    };
    const _getIfVersionIs = (v: number) => {
        if (null == _remoteVersion) return undefined;
        if (null == _interface) return undefined;
        if (v > _remoteVersion) return undefined;
        return _interface;
    };
    const _getActivationPromise = () => {
        if (_activationPromise != null) return _activationPromise;
        if (_isActivated) return _activationPromise = Promise.resolve();
        return _activationPromise = new Promise((resolve, reject) => {
            _promiseResolve = resolve;
            _promiseReject = reject;
        });
    };
    const _getRemote = () => {
        if (_remote === undefined) {
            _remote = {
                get name() { return _name },
                get version() { return _remoteVersion },
                get i() { return _getInterface() },
                v: (v: number) => _getIfVersionIs(v),
            };
        }
        return _remote;
    };
    const _getLazyRemote = () => {
        if (_lazyRemote === undefined) {
            _lazyRemote = {
                get name() { return _name },
                get version() { return _isActivated ? _remoteVersion : undefined },
                get i() { return _isActivated ? _getInterface() : undefined },
                v: (v: number) => { return _isActivated ? _getIfVersionIs(v) : undefined },
                get promise() {
                    if (_remoteVersion === 0) return Promise.reject('Remote interface not provided');
                    return _getActivationPromise()
                        .then(() => {
                            if (_remoteVersion === 0) throw new Error('Remote interface not provided');
                            return _getRemote();
                        });
                }
            };
        }
        return _lazyRemote;
    };
    const _resolve = () => {
        if (_promiseResolve != null) {
            _promiseResolve();
            _promiseResolve = _promiseReject = undefined;
        }
    };
    const _reject = (r?: any) => {
        if (_promiseReject != null) {
            _promiseReject(r);
            _promiseResolve = _promiseReject = undefined;
        }
    };
    return {
        get name() { return _name },
        get localVersion() {
            return _localVersion == null ? undefined : _localVersion;
        },
        setLocalVersion: (v: number) => {
            if ((_localVersion != null) && (_localVersion !== v)) throw new Error('A different local version is already set');
            _localVersion = v;
        },
        get localVersionNotified() { return _localVersionNotified },
        set localVersionNotified(v: boolean) {
            if ((!v) && (_localVersionNotified)) throw new Error('Local version already notified');
            _localVersionNotified = v;
            if (v && (_localVersion === 0)) {
                _remotelyPlugged = true;
            }
        },
        get remoteVersion() {
            return _remoteVersion == null ? undefined : _remoteVersion;
        },
        get isReadyForFactory() { return (_remoteVersion != null) && (!_factoryDone) },
        get isReadyForFactoryDep() { return _remoteVersion != null },
        setFactoryDone: () => {
            if (_remoteVersion == null) throw new Error('Remote version not set');
            if (_factoryDone) throw new Error('Factory already done');
            _factoryDone = true;
        },
        depGroup: undefined,
        get isReadyForActivation() { return _isActivated || (_hasRemoteInterface() && _remotelyPlugged) },
        get isActivated() { return _isActivated },
        setRemoteVersion: (v: number) => {
            if ((_remoteVersion != null) && (_remoteVersion !== v)) throw new Error('A different remote version is already set');
            _remoteVersion = v;
        },
        setRemoteInterface: (i: any) => {
            if (_remoteVersion == null) throw new Error('Remote version not set');
            if (_hasRemoteInterface()) {
                if (_remoteVersion === 0) {
                    if (i != null) throw new Error('Interface should be null');
                    return;
                }
                else throw new Error('Interface already provided.');
            }
            if (i == null) {
                if (_remoteVersion === 0) return;
                else throw new Error('Interface cannot be null');
            }
            _interface = i;
        },
        get hasRemoteInterface() {
            return _hasRemoteInterface();
        },
        setRemotelyPlugged: () => {
            if (_localVersion == null) throw new Error('local version not set');
            if (_remotelyPlugged) throw new Error('Remotely plugged already');
            _remotelyPlugged = true;
        },
        activate: () => {
            if (!_hasRemoteInterface()) throw new Error('Remote interface not provided.');
            if (!_remotelyPlugged) throw new Error('Interface not remotely plugged.');
            _isActivated = true;
            _resolve();
        },
        localDone: () => {
            if (_isActivated) return;
            if (_localVersion == null) {
                _localVersion = 0;
            }
        },
        remoteDone: () => {
            if (_isActivated) return;
            if (_remoteVersion == null) {
                _remoteVersion = 0;
                _resolve();
            }
        },
        getRemote: () => _getRemote(),
        getLazyRemote: () => _getLazyRemote(),
        get activationPromise() {
            return _getActivationPromise();
        }
    };
}
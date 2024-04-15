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
     * Indique si le contrat est prêt à être fourni à la fonction factory.
     * C'est à dire si la version remote est connue.
     */
    readonly isReadyForFactory: boolean;

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
     * Ne doit être appelé qu'une seule fois dès que la version locale est connue.
     * 
     * @param v la version locale du contrat
     */
    setLocalVersion: (v: number) => void;

    /**
     * Ne doit être appelé qu'une seule fois dès que la version distante est connue.
     * 
     * @param v la version distante du contrat
     */
    setRemoteVersion: (v: number) => void;

    /**
     * Ne doit être appelé qu'une seule fois dès que l'interface distante est obtenue.
     * 
     * @param i l'interface distante. null est considéré comme {}
     */
    setInterface: (i: any) => void;

    /**
     * Ne doit être appelé qu'une seule fois dès que l'implémentation locale a été
     * fournie à l'autre partie et que le branchement a été confirmé.
     */
    setRemotelyPlugged: () => void;

    /**
     * Active le contrat.
     */
    activate: () => void;

    /**
     * L'appel est optionnel. Il permet de signaler la fin de la négociation.
     * Si l'activation n'a pas eu lieu, l'interface ne sera pas fournie.
     */
    done: () => void;

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
}

/**
 * Permet de créer un objet ContractSlot.
 * 
 * @param name le nom du contrat
 * @returns Un objet ContractSlot vide
 */
export function createContractSlot(name: string): ContractSlot {
    const _name = name;
    let _localVersion: number | undefined = undefined;
    let _localVersionSet = false;
    let _remoteVersion: number | undefined = undefined;
    let _remoteVersionSet = false;
    let _interface: any = undefined;
    let _localyPlugged = false;
    let _remotelyPlugged = false;
    let _wontBeActivated = false;
    let _isActivated = false;
    let _r: any = undefined;
    let _lr: any = undefined;
    let _promise: Promise<any> | undefined = undefined;
    let _promiseResolve: any = undefined;
    let _promiseReject: any = undefined;
    const _getIfVersionIs = (v: number) => {
        if (null == _remoteVersion) return void 0;
        if (null == _interface) return void 0;
        if (v > _remoteVersion) return null;
        return _interface;
    };
    const _getRemote = () => {
        if (_r === undefined) {
            _r = {
                get name() { return _name },
                get version() { return _remoteVersion },
                get i() { return _interface },
                v: (v: number) => _getIfVersionIs(v),
            };
        }
        return _r;
    };
    const _getLazyRemote = () => {
        if (_lr === undefined) {
            _lr = {
                get name() { return _name },
                get version() { return _remoteVersion },
                get i() { return _interface },
                v: (v: number) => _getIfVersionIs(v),
                get promise() {
                    if (_isActivated) return Promise.resolve(_getRemote());
                    if (_promise === undefined) {
                        _promise = new Promise((resolve, reject) => {
                            _promiseResolve = resolve;
                            _promiseReject = reject;
                        });
                    }
                    return _promise;
                }
            };
        }
        return _lr;
    };
    const _resolve = () => {
        if (_promiseResolve != null) {
            _promiseResolve(_getRemote());
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
            if (_localVersionSet) return _localVersion
        },
        setLocalVersion: (v: number) => {
            if (_localVersionSet) throw new Error('Local version already set');
            _localVersionSet = true;
            _localVersion = v;
        },
        get remoteVersion() {
            if (_remoteVersionSet) return _remoteVersion
        },
        get isReadyForFactory() { return (!_wontBeActivated) && _remoteVersionSet },
        depGroup: undefined,
        get isReadyForActivation() { return (!_wontBeActivated) && (!_isActivated) && _localyPlugged && _remotelyPlugged },
        get isActivated() { return (!_wontBeActivated) && _localyPlugged && _remotelyPlugged },
        setRemoteVersion: (v: number) => {
            if (_wontBeActivated) throw new Error('Interface won\'t be provided');
            if (_remoteVersionSet) throw new Error('Version already set');
            _remoteVersionSet = true;
            _remoteVersion = v;
        },
        setInterface: (i: any) => {
            if (_wontBeActivated) throw new Error('Interface won\'t be provided');
            if (!_remoteVersionSet) throw new Error('Remote version not set');
            if (_localyPlugged) {
                if (_remoteVersion === 0) return;
                else throw new Error('Interface already provided.');
            }
            if (i == null) i = {};
            _interface = i;
            _localyPlugged = true;
        },
        setRemotelyPlugged: () => {
            if (!_localVersionSet) throw new Error('local version not set');
            if (_remotelyPlugged) {
                if (_remoteVersion === 0) return;
                else throw new Error('Remotely plugged already');
            }
            _remotelyPlugged = true;
        },
        activate: () => {
            if (_wontBeActivated) throw new Error('Interface won\'t be provided');
            if (!_localyPlugged) throw new Error('Interface not provided.');
            if (!_remotelyPlugged) throw new Error('Interface not remotely plugged.');
            if (_isActivated) throw new Error('Interface already activated.');
            _isActivated = true;
            _resolve();
        },
        done: () => {
            if (!_isActivated) {
                _wontBeActivated = true;
                _interface = null;
                _reject(new Error('Interface won\'t be provided'));
            }
        },
        getRemote: () => _getRemote(),
        getLazyRemote: () => _getLazyRemote(),
    };
}
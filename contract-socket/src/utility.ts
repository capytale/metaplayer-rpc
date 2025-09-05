import type { ContractInterface, Contract, Collection } from "@capytale/contract-type";

export type Side = 'metaplayer' | 'application';

export type OppositeSide<S extends Side> = {
    metaplayer: 'application';
    application: 'metaplayer';
}[S];

/**
 * Un type utilitaire pour obtenir les noms des contrats dans une collection.
 * 
 * @param CC Une collection de contrats.
 */
export type NamesOf<CC extends Collection> = {
    [K in keyof CC]: CC[K]['name'];
}[keyof CC];

/**
 * Un type utilitaire pour obtenir les identifiants des contrats dans une collection.
 * 
 * @param CC Une collection de contrats.
 */
export type IdsOf<CC extends Collection> = keyof CC;


/**
 * Le côté fournisseur d'une interface peut être synchrone ou asynchrone.
 */
type ProviderInterface<I extends ContractInterface> = {
    readonly [F in keyof I]: (...args: Parameters<I[F]>) => ReturnType<I[F]> | Promise<ReturnType<I[F]>>;
};

/**
 * Le côté distant d'une interface est forcément asynchrone. 
 */
type RemoteInterface<I extends ContractInterface> = {
    readonly [F in keyof I]: (...args: Parameters<I[F]>) => Promise<ReturnType<I[F]>>;
};

type RemoteFrom<C extends Contract, S extends Side> =
    {
        readonly name: C['name'];
        readonly version: C['version'];
    } & {
        // Le côté distant de l'interface.
        readonly i: RemoteInterface<C[S]>;
    };

/**
 * Un type utilitaire qui représente l'union de toutes les versions d'un contrat.
 * 
 * @param CC Une collection de contrats.
 * @param N Le nom d'un contrat dans la collection.
 * @param S Le côté de l'interface.
 */
type AnyVersion<CC extends Collection, N extends NamesOf<CC>, S extends Side> =
    {
        [K in keyof CC]: N extends CC[K]['name'] ? RemoteFrom<CC[K], S> : never
    }[keyof CC];

/**
* Un type utilitaire qui représente une version d'un contrat.
* 
* @param CC Une collection de contrats.
* @param N Le nom d'un contrat dans la collection.
* @param S Le côté de l'interface.
* @param V La version du contrat.
*/
type VersionOf<CC extends Collection, N extends NamesOf<CC>, S extends Side, V extends number> =
    {
        [K in keyof CC]: CC[K] extends { version: V } ? N extends CC[K]['name'] ? RemoteInterface<CC[K][S]> : never : never
    }[keyof CC];

/**
* Un type utilitaire qui représente l'interface qu'un fournisseur de contrat
* doit implémenter.
* 
* @param CC Une collection de contrats.
* @param I L'identifiant d'un contrat dans la collection.
* @param S Le côté de l'interface.
*/
export type Provider<
    CC extends Collection,
    I extends keyof CC,
    S extends Side> = ProviderInterface<CC[I][S]>;

export type NonNullRemote<
    CC extends Collection,
    N extends NamesOf<CC>,
    S extends Side> =
    AnyVersion<CC, N, S> &
    {
        v<V extends number>(v: V): undefined | VersionOf<CC, N, S, V>;
    };


export type Remote<
    CC extends Collection,
    N extends NamesOf<CC>,
    S extends Side> = ({ readonly name: N, readonly version: 0, readonly i: undefined } | AnyVersion<CC, N, S>) &
    {
        v<V extends number>(v: V): undefined | VersionOf<CC, N, S, V>;
    };

export type RemoteOf<
    CC extends Collection,
    I extends keyof CC,
    S extends Side> = Remote<CC, CC[I]['name'], S>;

export type LazyRemote<
    CC extends Collection,
    I extends NamesOf<CC>,
    S extends Side> =
    (
        { readonly version: undefined | 0, readonly i: undefined } |
        AnyVersion<CC, I, S>
    ) &
    {
        v<V extends number>(v: V): undefined | VersionOf<CC, I, S, V>;
        readonly promise: Promise<NonNullRemote<CC, I, S>>;
    };

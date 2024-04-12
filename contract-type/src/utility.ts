import type { ContractInterface, Contract, Side } from "./contract";
import type { Collection, IdsOf, IdOf } from "./collection";

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
    (C extends { variant: string } ?
        {
            readonly name: C['name'];
            readonly version: C['version'];
            readonly variant: C['variant'];
        } : {
            readonly name: C['name'];
            readonly version: C['version'];
        }) & {
            // Le côté distant de l'interface.
            readonly i: RemoteInterface<C[S]>;
        };

/**
 * Un type utilitaire qui représente l'union de toutes les versions d'un contrat.
 * 
 * @param CC Une collection de contrats.
 * @param I L'identifiant d'un contrat dans la collection.
 * @param S Le côté de l'interface.
 */
type AnyVersion<CC extends Collection, I extends IdsOf<CC>, S extends Side> =
    {
        [K in keyof CC]: I extends IdOf<CC[K]> ? RemoteFrom<CC[K], S> : never
    }[keyof CC];

/**
* Un type utilitaire qui représente une version d'un contrat.
* 
* @param CC Une collection de contrats.
* @param I L'identifiant d'un contrat dans la collection.
* @param S Le côté de l'interface.
* @param V La version du contrat.
*/
type VersionOf<CC extends Collection, I extends IdsOf<CC>, S extends Side, V extends number> =
    {
        [K in keyof CC]: CC[K] extends { version: V } ? I extends IdOf<CC[K]> ? RemoteInterface<CC[K][S]> : never : never
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

export type Remote<
    CC extends Collection,
    I extends IdsOf<CC>,
    S extends Side> = AnyVersion<CC, I, S> &
    {
        v<V extends number>(v: V): null | VersionOf<CC, I, S, V>;
    };

export type RemoteOf<
    CC extends Collection,
    I extends  keyof CC,
    S extends Side> = Remote<CC, IdOf<CC[I]>, S>;

export type LazyRemote<
    CC extends Collection,
    I extends IdsOf<CC>,
    S extends Side> = ({ readonly version: undefined, readonly i: undefined } | AnyVersion<CC, I, S>) &
    {
        v<V extends number>(v: V): undefined | null | VersionOf<CC, I, S, V>;
        readonly promise: Promise<Remote<CC, I, S>>;
    };

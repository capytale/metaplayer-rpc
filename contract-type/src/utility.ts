import type { ContractInterface, Contract, Side } from "./contract";
import type { Collection } from "./collection";

/**
 * Le côté fournisseur d'une interface peut être synchrone ou asynchrone.
 */
type ProviderInterface<I extends ContractInterface> = {
    [F in keyof I]: (...args: Parameters<I[F]>) => ReturnType<I[F]> | Promise<ReturnType<I[F]>>;
};

/**
 * Le côté distant d'une interface est forcément asynchrone. 
 */
type RemoteInterface<I extends ContractInterface> = {
    [F in keyof I]: (...args: Parameters<I[F]>) => Promise<ReturnType<I[F]>>;
};

type RemoteOf<CC extends Collection, I extends keyof CC, S extends Side> =
    (CC[I] extends { variant: string } ?
        {
            name: CC[I]['name'];
            version: CC[I]['version'];
            variant: CC[I]['variant'];
        } : {
            name: CC[I]['name'];
            version: CC[I]['version'];
        }) & {
            // Le côté distant de l'interface.
            i: RemoteInterface<CC[I][S]>;
        };

/**
 * Un type utilitaire qui représente l'union de toutes les versions d'un contrat.
 * 
 * @param CC Une collection de contrats.
 * @param I L'identifiant d'un contrat dans la collection.
 * @param S Le côté de l'interface.
 */
type AllVersions<CC extends Collection, I extends keyof CC, S extends Side> =
    (CC[I] extends { variant: string } ?
        {
            [K in keyof CC]: CC[K] extends { name: CC[I]['name'], variant: CC[I]['variant'] } ? RemoteOf<CC, K, S> : never
        } :
        {
            [K in keyof CC]: CC[K] extends { name: CC[I]['name'] } ? RemoteOf<CC, K, S> : never
        })[keyof CC];

/**
 * Un type utilitaire qui représente une autre version d'un contrat.
 * 
 * @param CC Une collection de contrats.
 * @param I L'identifiant d'un contrat dans la collection.
 * @param S Le côté de l'interface.
 * @param V La version du contrat.
 */
type OtherVersion<CC extends Collection, I extends keyof CC, S extends Side, V extends number> =
    (CC[I] extends { variant: string } ?
        {
            [K in keyof CC]: CC[K] extends { name: CC[I]['name'], version: V, variant: CC[I]['variant'] } ? RemoteInterface<CC[K][S]> : never
        } :
        {
            [K in keyof CC]: CC[K] extends { name: CC[I]['name'], version: V } ? RemoteInterface<CC[K][S]> : never
        })[keyof CC];

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
    I extends keyof CC,
    S extends Side> = AllVersions<CC, I, S> &
    {
        v<V extends number>(v: V): null | OtherVersion<CC, I, S, V>;
    };

export type LazyRemote<
    CC extends Collection,
    I extends keyof CC,
    S extends Side> = ({ version: undefined, i: undefined } | AllVersions<CC, I, S>) &
    {
        v<V extends number>(v: V): undefined | null | OtherVersion<CC, I, S, V>;
        promise: Promise<Remote<CC, I, S>>;
    };

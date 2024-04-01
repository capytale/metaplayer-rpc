import type { ContractInterface, Contract, Side } from "./contract";
import type { Collection } from "./collection";

/**
 * Le côté distant d'une interface est forcément asynchrone.
 */
type RemoteInterface<I extends ContractInterface> = {
    [F in keyof I]: (...args: Parameters<I[F]>) => Promise<ReturnType<I[F]>>;
};

/**
 * Le côté fournisseur d'une interface peut être synchrone ou asynchrone.
 */
type ProviderInterface<I extends ContractInterface> = {
    [F in keyof I]: (...args: Parameters<I[F]>) => ReturnType<I[F]> | Promise<ReturnType<I[F]>>;
};

type IdentifiedProviderInterface<C extends Contract, S extends Side> =
    C extends { variant: string } ?
    ProviderInterface<C[S]> & { name: C['name'], version: C['version'], variant: C['variant'] } :
    ProviderInterface<C[S]> & { name: C['name'], version: C['version'] };

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
    S extends Side> = IdentifiedProviderInterface<CC[I], S>;
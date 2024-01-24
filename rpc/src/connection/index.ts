import type { ContractInterface, Contract } from '../contract';

/**
 * Le côté distant d'une interface est forcément asynchrone.
 */
export type Remote<I extends ContractInterface> = {
  [F in keyof I]: (...args: Parameters<I[F]>) => Promise<ReturnType<I[F]>>;
};

/**
 * Le côté fournisseur d'une interface peut être synchrone ou asynchrone.
 */
export type Provider<I extends ContractInterface> = {
  [F in keyof I]: (...args: Parameters<I[F]>) => ReturnType<I[F]> | Promise<ReturnType<I[F]>>;
};

/**
 * MetaPlayerSocket
 * Un socket permet à une partie de consommer l'interface de l'autre partie
 * et de lui exposer sa propre interface.
 */
export type MetaPlayerSocket<C extends Contract> = {
  plug(provider: Provider<C['metaplayer']>): void;
  readonly application: Remote<C['application']>;
}

/**
 * ApplicationSocket
 * Un socket permet à une partie de consommer l'interface de l'autre partie
 * et de lui exposer sa propre interface.
 */
export type ApplicationSocket<C extends Contract> = {
  plug(provider: Provider<C['application']>): void;
  readonly metaplayer: Remote<C['metaplayer']>;
}

/**
 * Un contrat d'interface est un ensemble de fonctions.
 */
export type ContractInterface = {
  readonly [key: string]: (...args: any[]) => unknown;
};

export type Side = 'metaplayer' | 'application';

export type OppositeSide<S extends Side> = {
  metaplayer: 'application';
  application: 'metaplayer';
}[S];

/**
 * Un contrat spécifie l'interface exposée par chaque partie.
 * Il est identifié par un nom, une version et éventuellement une variante.
 */
export type Contract = {
  name: string;
  version: number;
  variant?: string;
  metaplayer: ContractInterface;
  application: ContractInterface;
}

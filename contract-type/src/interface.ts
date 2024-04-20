/**
 * Un contrat d'interface est un ensemble de fonctions.
 */
export type ContractInterface = {
    readonly [key: string]: (...args: any[]) => unknown;
  };
  
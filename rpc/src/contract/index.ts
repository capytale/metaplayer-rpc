/**
 * Un contrat d'interface est un ensemble de fonctions.
 */
export type ContractInterface = {
    [key: string]: (...args: unknown[]) => unknown;
};

/**
 * Un contrat spécifie l'interface exposée par chaque partie.
 */
export type Contract = {
  metaplayer: ContractInterface;
  application: ContractInterface;
}

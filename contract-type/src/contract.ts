import type { ContractInterface } from './interface';

/**
 * Un contrat spécifie l'interface exposée par chaque partie.
 * Il est identifié par un nom et une version, et comporte les implémentations des contrats du
 * meta-player et de l'application.
 */
export type Contract = {
  name: string;
  version: number;
  metaplayer: ContractInterface;
  application: ContractInterface;
}

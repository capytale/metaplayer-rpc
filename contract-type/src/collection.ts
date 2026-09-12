import type { Contract } from "./contract";

/**
 * Une collection de contrats est en ensemble d'items:
 * - Identifiant de contrat
 * - Contract
 */
export type Collection = { [key: string]: Contract };

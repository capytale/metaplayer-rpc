import type { Contract } from "./contract";
type Identified = { name: string, version: number };

/**
 * Un type utilitaire pour ajouter les propriétés d'identifications à un contrat
 * ou à un tuple de contrats.
 * 
 * @param C Le type de contrat ou de tuple de contrats.
 * @param I Le type d'identifiant à ajouter.
 */
export type AddIdData<C, I> = C extends {}[] ?
    { [Index in keyof C]: C[Index] & I } :
    C & I;

/**
 * Un type qui représente un identifiant de contrat. 
 * Il est composé du nom du contrat et de sa version.
 * Exemple: `content:1`
 * 
 * @param C Le type de contrat.
 */
type IdOf<C extends { name: string, version: number }> =
    `${C['name']}:${C['version']}`;

type IdContractTuple<T extends { name: string, version: number }[]> = {
    [Index in keyof T]: [IdOf<T[Index]>, T[Index]]
}[number];

type Indexed<L extends [string, unknown]> = {
    [I in L[0]]: Extract<L, [I, any]>[1];
};

export type Collection = { [key: string]: Contract };

/**
 * Un type utilitaire pour indexer un ensemble de contrats par leur identifiant complet.
 * 
 * @param T Un tuple de contrats.
 */
export type CollectionOf<T extends { name: string, version: number }[]> = Indexed<IdContractTuple<T>>;

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

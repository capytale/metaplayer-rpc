type AddId<C, I extends { name: string, variant?: string }> =
    I extends { variant: string } ?
    C & { name: `${I['name']}(${I['variant']})` } :
    C & { name: I['name'] };

/**
 * Un type utilitaire pour ajouter les propriétés d'identifications à un contrat
 * ou à un tuple de contrats.
 * 
 * @param C Le type de contrat ou de tuple de contrats.
 * @param I Le nom et éventuellement la variante à ajouter.
 */
export type AddIdData<C, I extends { name: string, variant?: string }> =
    C extends {}[] ?
    { [Index in keyof C]: AddId<C[Index], I> } :
    AddId<C, I>;

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

/**
 * Un type utilitaire pour indexer un ensemble de contrats par leur identifiant complet.
 * 
 * @param T Un tuple de contrats.
 */
export type CollectionOf<T extends { name: string, version: number }[]> = Indexed<IdContractTuple<T>>;

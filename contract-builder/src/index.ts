export type ContractVariant = { name: string, variant?: string }
export type ContractWithVersion = { name: string, version: number }


/**
 * Type constructeur pour spécifier le nom d'un contrat à partir du ContractVariant fourni.
 * les contraintes de construction d'un nom complet de contrat avec la variante à utiliser :
 *
 *      AddId<T, {name:string, variant:string}> -> {...T, name: `${ name }(${ variant })`}
 *      AddId<T, {name:string}>                 -> {...T, name}
 *
 * Utilisable sur un Contract ou un tuple de Contracts.
 */
type AddId<C, Cva extends ContractVariant> =
    Cva extends { variant: string } ?
    C & { name: `${Cva['name']}(${Cva['variant']})` } :
    C & { name: Cva['name'] };

/**
 * Un type utilitaire pour ajouter les propriétés d'identifications en appliquant `AddId` au
 * type fourni, que ce soit un tuple de contrats ou un contrat seul.
 *
 * @param Contract Le type de contrat ou de tuple de contrats.
 * @param Cva Le nom et éventuellement la variante à ajouter.
 */
export type AddIdData<Contract, Cva extends ContractVariant> =
    Contract extends {}[] ?
    { [Index in keyof Contract]: AddId<Contract[Index], Cva> } :
    AddId<Contract, Cva>;

/**
 * Un type qui représente un identifiant de contrat, composé du nom du contrat et de sa version.
 * Exemple: `content:1`  ou `simple-content-eval(json):2`
 *
 * @param C Le type de contrat.
 */
type IdOf<C extends ContractWithVersion> = `${C['name']}:${C['version']}`;


/**
 * Convertit dans un premier temps une liste de types de contrats (un tuple, en fait) en un type
 * de liste/tuple de tuples de deux éléments: [id du contrat, contrat], puis construit l'union
 * des tuples résultants :
 *
 *      IdContractTuple<[A, B, C, ...]>  ->  [Id<A>, A] | [Id<B>, B] | [Id<C>, C] | ...
 */
type IdContractTuple<CveTup extends ContractWithVersion[]> = {
    [Index in keyof CveTup]: [IdOf<CveTup[Index]>, CveTup[Index]]
}[number];

/**
 * Permet de faire l'association entre un id de contrat et le type du contrat lui-même.
 *
 *      Indexed<IdContractTuple<[A, B, C, ...]>>  ->  {Id<A>: A, Id<B>: B, ...}
 */
type Indexed<L extends [string, unknown]> = {
    [I in L[0]]: Extract<L, [I, any]>[1];
};

/**
 * Un type utilitaire pour indexer un ensemble de contrats par leur identifiant complet.
 *
 * `CollectionOf<Ctr[]>` est à voir comme un `RecordOfContractVersionsByIds<Ctr[]>`, pour
 * un type de contrat donné (workflow, simple-content, ...).
 *
 * @param CvTup Un tuple de contrats, donnant les différentes variantes et versions concrètement
 * utilisables pour ce type de contrat.
 */
export type CollectionOf<CvTup extends ContractWithVersion[]> = Indexed<IdContractTuple<CvTup>>;

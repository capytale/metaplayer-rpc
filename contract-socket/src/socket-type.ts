import { Collection } from "@capytale/contract-type";
import {
    IdsOf,
    NamesOf,
    Side,
    OppositeSide,
    Provider,
    Remote,
    RemoteOf,
    LazyRemote
} from "./utility";

/**
 * Socket permet de brancher des contrats et de les utiliser.
 */
export type Socket<CC extends Collection, S extends Side> = {
    /**
     * Permet de fournir son implémentation locale de contrats afin de
     * les exposer à la partie distante.
     * La fonction factory fournie est chargée de retourner les implémentations locale.
     * Elle reçoit en argument les interfaces distantes des mêmes contrats et optionnellement
     * les interfaces distantes d'autres contrats qu'elle n'implémente pas mais dont elle dépend.
     * Une implémentaion réciproque de ces dépendances peut être fournie par un autre appel de la
     * méthode plug mais celui-ci doit avoir été fait avant.
     * Si toutefois cela n'a pas été fait, la partie distante en sera informée par une version de 
     * contrat présenté égale à 0. Il n'est alors plus possible de fournir l'implémentation réciproque
     * des dépendances par la suite.
     * 
     * @param ids Un tableau d'identifiants de contrats de la forme 'nom:version' où
     * version est la version implémentée localement du contrat.
     * @param deps Un tableau de noms de contrats dépendants non implémentés par cette factory.
     * @param factory Une fonction qui reçoit un tableau de Remote, un tableau de Remote dépendants
     * et retourne un tableau de Provider.
     */
    plug<const Ids extends IdsOf<CC>[], const Names extends NamesOf<CC>[]>(ids: Ids, deps: Names, factory: (remotes: {
        [Index in keyof Ids]: RemoteOf<CC, Ids[Index], OppositeSide<S>>
    }, deps: {
        [Index in keyof Names]: Remote<CC, Names[Index], OppositeSide<S>>
    }) => { [Index in keyof Ids]: Provider<CC, Ids[Index], S> }): void;

    /**
     * Une version simplifiée de la méthode plug qui ne prend pas en compte les dépendances.
     * 
     * @param ids Un tableau d'identifiants de contrats de la forme 'nom:version' où
     * version est la version implémentée localement du contrat.
     * @param factory Une fonction qui reçoit un tableau de Remote et retourne un tableau de Provider.
     */
    plug<const Ids extends IdsOf<CC>[]>(ids: Ids, factory: (remotes: {
        [Index in keyof Ids]: RemoteOf<CC, Ids[Index], OppositeSide<S>>
    }) => { [Index in keyof Ids]: Provider<CC, Ids[Index], S> }): void;

    /**
     * Cette méthode peut être appelée une fois que toutes les implémentations de contrats
     * ont été fournies.
     * Elle permet à la partie distante de ne plus attendre des contrats qui ne seront pas fournis.
     */
    plugsDone(): void;

    /**
     * Pemet d'utiliser des contrats distants sans fournir d'implémentation réciproque.
     * L'utilisation se fait à l'intérieur de la fonction fournie en argument. Elle sera
     * invoquée dès que les contrats distants seront disponibles.
     * Une implémentaion réciproque peut avoir été fournie au préalable par
     * l'utilisation de la méthode @see plug.
     * Mais, si cela n'a pas été fait, la partie distante en sera informée par une version de
     * contrat présentée égale à 0. Il n'est alors plus possible de fournir une implémentation
     * réciproque par la suite.
     * 
     * @param names les noms des contrats distants à utiliser
     * @param func la fonction qui utilise les contrats distants
     */
    use<const Names extends NamesOf<CC>[]>(names: Names, func: (remotes: {
        [Index in keyof Names]: Remote<CC, Names[Index], OppositeSide<S>>
    }) => void): void;

    /**
     * Une autre façon que la méthode @see use d'utiliser des contrats distants sans fournir
     * d'implémentation réciproque.
     * Les contrats distants renvoyés sont des objets LazyRemote qui présentent une référence
     * à l'interface du contrat distant. Cette référence ne reçoit sa valeur que lorsque
     * le contrat distant est disponible. L'objet LazyRemote possède aussi une propriété promise
     * qui sera résolue lorsque l'interface du contrat distant sera disponible.
     * La fourniture éventuelle de l'implémentation réciproque suit les mêmes règles que pour
     * la méthode @see use.
     * 
     * @param names les noms des contrats distants à utiliser
     * @returns un tableau des contrats distants 
     */
    get<const Names extends NamesOf<CC>[]>(names: Names): {
        [Index in keyof Names]: LazyRemote<CC, Names[Index], OppositeSide<S>>
    };
};

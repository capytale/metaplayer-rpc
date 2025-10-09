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

export type Implementations<
    Ids extends IdsOf<CC>[],
    CC extends Collection,
    S extends Side> = {
        [Index in keyof Ids]: Provider<CC, Ids[Index], S>
    };

/**
 * Socket permet de brancher des contrats et de les utiliser.
 */
export type Socket<CC extends Collection, S extends Side> = {
    /**
     * Permet de fournir l'implémentation locale d'un contrat afin de
     * l'exposer à la partie distante.
     * La fonction factory fournie est chargée de retourner l'implémentation locale.
     * Elle reçoit en argument l'interface distante du même contrat.
     * La fonction factory peut consulter la version implémentée par la partie distante.
     * Une version égale à 0 signifie que la partie distante n'a pas fourni d'implémentation.
     * L'interface distante ne doit pas être utilisée dans le corps de la fonction factory
     * mais elle peut l'être dans l'implémentation retournée.
     * 
     * @param id Un identifiant de contrat de la forme 'nom:version' où
     * version est la version implémentée localement du contrat.
     * @param factory Une fonction qui reçoit le Remote et retourne un Provider.
     */
    plug<const Id extends IdsOf<CC>>(id: Id, factory: (remote: RemoteOf<CC, Id, OppositeSide<S>>) => Provider<CC, Id, S>): void;

    /**
     * Cette version de la méthode plug permet de fournir l'implémentation locale de plusieurs
     * contrats en même temps.
     * La liste des contrats implémentés est fournie dans le tableau ids.
     * La fonction factory reçoit en argument un tableau des interfaces distantes des contrats implémentés
     * et doit retourner un tableau des implémentations locales correspondantes.
     * 
     * @param ids Un tableau d'identifiants de contrats de la forme 'nom:version' où
     * version est la version implémentée localement du contrat.
     * @param factory Une fonction qui reçoit un tableau de Remote et retourne un tableau de Provider.
     */
    plug<const Ids extends IdsOf<CC>[]>(ids: Ids, factory: (remotes: {
        [Index in keyof Ids]: RemoteOf<CC, Ids[Index], OppositeSide<S>>
    }) => Implementations<Ids, CC, S>): void;

    /**
     * Cette version de la méthode plug déclare des dépendances en plus du contrat implémenté pour
     * la fonction factory.
     * En plus de l'interface distante du contrat implémenté, la fonction factory reçoit en argument
     * un tableau des interfaces distantes des contrats dépendants.
     * 
     * @param id Un identifiant de contrat de la forme 'nom:version' où
     * version est la version implémentée localement du contrat.
     * @param deps Un tableau de noms de contrats dépendants non implémentés par cette factory.
     * @param factory Une fonction qui reçoit l'interface distante du contrat implémenté et un tableau
     * des interfaces distantes des contrats dépendants et retourne un Provider.
     */
    plug<const Id extends IdsOf<CC>, const Names extends NamesOf<CC>[]>(
        id: Id, deps: Names, factory: (remote: RemoteOf<CC, Id, OppositeSide<S>>,
            deps: {
                [Index in keyof Names]: Remote<CC, Names[Index], OppositeSide<S>>
            }) => Provider<CC, Id, S>): void;

    /**
     * Cette version de la méthode plug déclare des dépendances en plus des contrats implémentés pour
     * la fonction factory.
     * En plus des interfaces distantes des contrats implémentés, la fonction factory reçoit en argument
     * un tableau des interfaces distantes des contrats dépendants.
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
    }) => Implementations<Ids, CC, S>): void;



    /**
     * Cette méthode doit être appelée une fois que toutes les implémentations de contrats
     * ont été fournies.
     * Elle permet à la partie distante de ne plus attendre des contrats qui ne seront pas fournis.
     */
    plugsDone(): void;

    /**
     * Cette méthode permet d'utiliser un contrat distant.
     * L'utilisation se fait à l'intérieur de la fonction fournie en argument. Elle sera
     * invoquée dès que l'état du contrat distant est disponible.
     * Si la version du contrat distant est 0, cela signifie que la partie distante ne
     * fournit pas d'implémentation pour ce contrat.
     * 
     * @param name Le nom du contrat distant à utiliser
     * @param func La fonction qui utilise le contrat distant
     */
    use<const Name extends NamesOf<CC>>(name: Name, func: (remote: Remote<CC, Name, OppositeSide<S>>) => void): void;

    /**
     * Cette version de la méthode use permet d'utiliser plusieurs contrats distants en même temps.
     * 
     * @param names les noms des contrats distants à utiliser
     * @param func la fonction qui utilise les contrats distants
     */
    use<const Names extends NamesOf<CC>[]>(names: Names, func: (remotes: {
        [Index in keyof Names]: Remote<CC, Names[Index], OppositeSide<S>>
    }) => void): void;

    /**
     * Comme la méthode use, mais retourne une promesse qui se résout avec la valeur de
     * retour de la fonction fournie en argument.
     * 
     * @param name Le nom du contrat distant à utiliser
     * @param func La fonction qui utilise le contrat distant
     * 
     * @returns une promesse qui se résout avec la valeur de retour de la fonction fournie en argument
     */
    exec<const Name extends NamesOf<CC>, T>(name: Name, func: (remote: Remote<CC, Name, OppositeSide<S>>) => T): Promise<Awaited<T>>;

    /**
     * Cette version de la méthode exec permet d'utiliser plusieurs contrats distants en même temps.
     * 
     * @param names les noms des contrats distants à utiliser
     * @param func la fonction qui utilise les contrats distants
     * 
     * @returns une promesse qui se résout avec la valeur de retour de la fonction fournie en argument
     */
    exec<const Names extends NamesOf<CC>[], T>(names: Names, func: (remotes: {
        [Index in keyof Names]: Remote<CC, Names[Index], OppositeSide<S>>
    }) => T): Promise<Awaited<T>>;

    /**
     * Une autre façon que la méthode use d'utiliser des contrats distants.
     * Les contrats distants renvoyés sont des objets LazyRemote qui présentent une référence
     * à l'interface du contrat distant. Cette référence ne reçoit sa valeur que lorsque
     * le contrat distant est disponible.
     * 
     * @deprecated Préférer les méthodes use et exec
     * 
     * @param names les noms des contrats distants à utiliser
     * @returns un tableau des contrats distants 
     */
    get<const Names extends NamesOf<CC>[]>(names: Names): {
        [Index in keyof Names]: LazyRemote<CC, Names[Index], OppositeSide<S>>
    };
};

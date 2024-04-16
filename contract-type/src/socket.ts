import { Collection, IdsOf, NamesOf } from "./collection";
import { Side, OppositeSide } from "./contract";
import { Provider, Remote, RemoteOf, LazyRemote } from "./utility";

/**
 * Socket permet de brancher des contrats et de les utiliser.
 */
export type Socket<CC extends Collection, S extends Side> = {
    /**
     * Permet de fournir son implémentation d'un ou plusieurs contrats.
     * 
     * @param ids Un tableau d'identifiants de contrats.
     * @param deps Un tableau de noms de contrats dépendants.
     * @param factory Une fonction qui reçoit un tableau de Remote et retourne un tableau de Provider.
     */
    plug<Ids extends IdsOf<CC>[], Names extends NamesOf<CC>[]>(ids: Ids, deps: Names, factory: (remotes: {
        [Index in keyof Ids]: RemoteOf<CC, Ids[Index], OppositeSide<S>>
    }, deps: {
        [Index in keyof Names]: Remote<CC, Names[Index], OppositeSide<S>>
    }) => { [Index in keyof Ids]: Provider<CC, Ids[Index], S> }): void;
    plug<Ids extends IdsOf<CC>[]>(ids: Ids, factory: (remotes: {
        [Index in keyof Ids]: RemoteOf<CC, Ids[Index], OppositeSide<S>>
    }) => { [Index in keyof Ids]: Provider<CC, Ids[Index], S> }): void;
    use<Names extends NamesOf<CC>[]>(names: Names, func: (remotes: {
        [Index in keyof Names]: Remote<CC, Names[Index], OppositeSide<S>>
    }) => void): void;
    get<Names extends NamesOf<CC>[]>(names: Names): {
        [Index in keyof Names]: LazyRemote<CC, Names[Index], OppositeSide<S>>
    };
};

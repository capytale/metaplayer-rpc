import { Collection, Remote, RemoteOf, LazyRemote, Provider, IdsOf, NamesOf, Side, OppositeSide } from '@capytale/contract-type';
import type { Link } from './link';
import { type ContractsHolder, createContractsHolder } from './contracts-holder';
import { parseId } from './id-parser';

/**
 * Socket permet de brancher des contrats et de les utiliser.
 */
export type Socket<CC extends Collection, S extends Side> = {
    /**
     * Permet de fournir son implémentation d'un ou plusieurs contrats.
     * 
     * @param ids Un tableau d'identifiants de contrats.
     * @param factory Une fonction qui reçoit un tableau de Remote et retourne un tableau de Provider.
     */
    plug<Ids extends IdsOf<CC>[]>(ids: Ids, factory: (remotes: {
        [Index in keyof Ids]: RemoteOf<CC, Ids[Index], OppositeSide<S>>
    }) => { [Index in keyof Ids]: Provider<CC, Ids[Index], S> }): void;
    plug<Ids extends IdsOf<CC>[], Names extends NamesOf<CC>[]>(ids: Ids, deps: Names, factory: (remotes: {
        [Index in keyof Ids]: RemoteOf<CC, Ids[Index], OppositeSide<S>>
    }, deps: {
        [Index in keyof Names]: Remote<CC, Names[Index], OppositeSide<S>>
    }) => { [Index in keyof Ids]: Provider<CC, Ids[Index], S> }): void;
    use<Names extends NamesOf<CC>[]>(names: Names, func: (remotes: {
        [Index in keyof Names]: Remote<CC, Names[Index], OppositeSide<S>>
    }) => void): void;
    get<Names extends NamesOf<CC>[]>(names: Names): {
        [Index in keyof Names]: LazyRemote<CC, Names[Index], OppositeSide<S>>
    };
};

export function createSocket<CC extends Collection, S extends Side>(link: Link): Socket<CC, S> {
    const _link = link;
    const _holder: ContractsHolder = createContractsHolder(_link)
    return {
        plug(ids: any[], deps: any[] | any, factory: any = undefined): void {
            if (factory == null) {
                factory = deps;
                deps = [];
            }
            const _ids = ids.map(id => {
                const _id = parseId(id as string);
                if (null == _id) {
                    throw new Error('Invalid contract id : ' + (id as string));
                }
                return _id;
            });
            const _deps = (deps as string[]).map(name => ({ name, version: 0}));
            _holder.declareFactory(_ids, _deps, factory);
        },
        use<Names extends NamesOf<CC>[]>(names: Names, func: (remotes: {
            [Index in keyof Names]: Remote<CC, Names[Index], OppositeSide<S>>
        }) => void): void {
            const _slots = names.map(_name => _holder.get(_name));
            const _remotes = _slots.map(slot => slot.getRemote());
            const _notReady = _slots.filter(slot => !slot.isActivated);
            if (_notReady.length > 0) {
                const _promises = _notReady.map(slot => slot.getLazyRemote().promise);
                Promise.all(_promises).then(() => {
                    func(_remotes as any);
                });
            } else {
                func(_remotes as any);
            }
        },
        get<Names extends NamesOf<CC>[]>(names: Names): {
            [Index in keyof Names]: LazyRemote<CC, Names[Index], OppositeSide<S>>
        } {
            const _remotes = names.map(_name => (_holder.get(_name)).getLazyRemote());
            return _remotes as any;
        }
    };
}

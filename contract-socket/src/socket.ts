import type { Collection } from '@capytale/contract-type';
import type { Remote, LazyRemote, NamesOf, Side, OppositeSide } from './utility';
import type { Socket } from './socket-type';
import type { Link } from './link';
import { type ContractsHolder, createContractsHolder } from './contracts-holder';
import { parseId } from './id-parser';

export function createSocket<CC extends Collection, S extends Side>(link: Link): Socket<CC, S> {
    const _link = link;
    const _holder: ContractsHolder = createContractsHolder(_link)
    return {
        plug(ids: any[], deps: any[] | any, factory: any = undefined): void {
            if (_holder.done) throw new Error('Cannot plug after plugsDone.');
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
            const _deps = (deps as string[]).map(name => ({ name, version: 0 }));
            _holder.declareFactory(_ids, _deps, factory);
        },
        plugsDone() {
            _holder.done = true;
        },
        use<Names extends NamesOf<CC>[]>(names: Names, func: (remotes: {
            [Index in keyof Names]: Remote<CC, Names[Index], OppositeSide<S>>
        }) => void): void {
            const _slots = names.map(_name => _holder.get(_name));
            const _remotes = _slots.map(slot => slot.getRemote());
            const _notReady = _slots.filter(slot => !slot.isActivated);
            if (_notReady.length > 0) {
                const _promises = _notReady.map(slot => slot.activationPromise);
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

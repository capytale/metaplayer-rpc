import type { Collection } from '@capytale/contract-type';
import type { Remote, LazyRemote, NamesOf, Side, OppositeSide } from './utility';
import type { Socket } from './socket-type';
import type { Link } from './link';
import { type ContractsHolder, createContractsHolder } from './contracts-holder';
import { parseId } from './id-parser';
import { prefixMsg } from './prefix-message';

export function createSocket<CC extends Collection, S extends Side>(link: Link): Socket<CC, S> {
    const _link = link;
    const _holder: ContractsHolder = createContractsHolder(_link)
    function pm(m: string): string {
        return prefixMsg(_link.name, m);
    }
    return {
        plug(ids: any[], deps: any[] | any, factory: any = undefined): void {
            if (_holder.done) throw new Error(pm('Cannot plug after plugsDone.'));
            if (factory == null) {
                factory = deps;
                deps = [];
            }
            let arrayMode = true;
            if (!Array.isArray(ids)) {
                ids = [ids];
                arrayMode = false;
            }
            const _ids = ids.map(id => {
                const _id = parseId(id as string);
                if (null == _id) {
                    throw new Error(pm('Invalid contract id : ' + (id as string)));
                }
                return _id;
            });
            _holder.declareFactory(_ids, deps, factory, arrayMode);
        },
        plugsDone() {
            _holder.done = true;
        },
        use(names: any[], func: any): void {
            let arrayMode = true;
            if (!Array.isArray(names)) {
                names = [names];
                arrayMode = false;
            }
            _holder.declareCallback(names, func, arrayMode);
        },
        get<Names extends NamesOf<CC>[]>(names: Names): {
            [Index in keyof Names]: LazyRemote<CC, Names[Index], OppositeSide<S>>
        } {
            const _remotes = names.map(_name => (_holder.get(_name)).getLazyRemote());
            return _remotes as any;
        }
    };
}

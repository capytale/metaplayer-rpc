import type {CollectionEx} from './example';

import type { Provider, Remote, LazyRemote } from '..';

type FooMP = Provider<CollectionEx, 'foo:2', 'metaplayer'>;
type FooAP = Provider<CollectionEx, 'foo:1', 'application'>;

type FooMR = Remote<CollectionEx, 'foo', 'metaplayer'>;
type FooMLR = LazyRemote<CollectionEx, 'foo', 'metaplayer'>;
type BarAR = Remote<CollectionEx, 'bar(text)', 'application'>;


declare const mr: FooMR;

mr.v(2)?.hello();

mr.version;



if (mr.version === 3) {
    mr.i.hello();
}

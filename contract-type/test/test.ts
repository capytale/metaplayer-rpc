import type { ExampleCollection } from './example';

import type { Provider, Remote, LazyRemote } from '../src';

type MpFooProvider = Provider<ExampleCollection, 'foo:2', 'metaplayer'>;
type AppFooProvider = Provider<ExampleCollection, 'foo:1', 'application'>;

type MpFooRemote = Remote<ExampleCollection, 'foo', 'metaplayer'>;
declare const mpFooRemote: MpFooRemote;
type MpFooLazyRemote = LazyRemote<ExampleCollection, 'foo', 'metaplayer'>;
declare const mpFooLazyRemote: MpFooLazyRemote;
type AppBarTextRemote = Remote<ExampleCollection, 'bar(text)', 'application'>;
declare const appBarTextRemote: AppBarTextRemote;
type AppBarNumRemote = Remote<ExampleCollection, 'bar(num)', 'application'>;
declare const appBarNumRemote: AppBarNumRemote;


mpFooRemote.v(2)?.hello();

mpFooRemote.i!.ping(true);

mpFooRemote.version;

if (mpFooRemote.version === 3) {
    mpFooRemote.i.hello();
}

appBarTextRemote.v(1)?.put('hello');
appBarNumRemote.v(1)?.put(1);
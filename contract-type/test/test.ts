type Test<A, B> = A extends B ? true : false;

type T = Test<
    (...args: string[]) => number,
    (...args: any[]) => unknown
>;

type FV1 = {
    version: 1;
    metaplayer: {
        ping(): 'pong';
    };
    application: {
        pong(): 'ping';
    };
}

type FV2 = {
    version: 2;
    metaplayer: {
        ping(): 'pong';
        hello(): 'world';
    }
    application: {
        pong(): 'ping';
    };
}

type FV3 = {
    version: 3;
    metaplayer: {
        ping(): 'pong';
        hello(): 'world';
        goodbye(): 'world';
    }
    application: {
        pong(): 'ping';
    };
}

type SV1 = {
    version: 1;
    metaplayer: {
        sping(): 'pong';
    };
    application: {
        spong(): 'ping';
    };
}



import type { AddIdData, CollectionOf, Side, Collection, IdsOf } from '..';
//[V1, V2, V3];
type FContracts = AddIdData<[FV1, FV2, FV3], { name: 'first' }>;
type SContracts = AddIdData<[SV1], { name: 'second' }>;

type Collection1 = CollectionOf<FContracts> & CollectionOf<SContracts>;

type Ids = IdsOf<Collection1>;

export type C1 = Collection1['first:1'];
export type C2 = Collection1['first:2'];
export type C3 = Collection1['first:3'];
export type C4 = Collection1['second:1'];

import type { Provider, Remote, LazyRemote } from '..';

type MP = Provider<Collection1, 'first:2', 'metaplayer'>;
type AP = Provider<Collection1, 'first:1', 'application'>;

type MR = Remote<Collection1, 'first', 'metaplayer'>;
type MLR = LazyRemote<Collection1, 'first', 'metaplayer'>;
type AR = Remote<Collection1, 'first', 'application'>;


declare const mr: MR;

mr.v(2)?.hello();

mr.version



if (mr.version === 3) {
    mr.i.hello();
}

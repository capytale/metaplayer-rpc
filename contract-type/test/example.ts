type FV1 = {
    version: 1;
    metaplayer: {
        ping(echo: boolean): 'pong';
    };
    application: {
        pong(): 'ping';
    };
}

type FV2 = {
    version: 2;
    metaplayer: {
        ping(echo: boolean): 'pong';
        hello(): 'world';
    }
    application: {
        pong(): 'ping';
    };
}

type FV3 = {
    version: 3;
    metaplayer: {
        ping(echo: boolean): 'pong';
        hello(): 'world';
    }
    application: {
        pong(): 'ping';
        goodbye(): 'world';
    };
}

type SV1<T> = {
    version: 1;
    metaplayer: {
        get(): T;
    };
    application: {
        put(v: T): void;
    };
}

type SV2<T> = {
    version: 2;
    metaplayer: {
        get(): T;
    };
    application: {
        put(v: T): void;
        del(): void;
    };
}



import type { AddIdData, CollectionOf, Side, Collection } from '..';
//[V1, V2, V3];
type FContracts = AddIdData<[FV1, FV2, FV3], { name: 'foo' }>;
type SContractsS = AddIdData<[SV1<string>, SV2<string>], { name: 'bar', variant: 'string' }>;
type SContractsN = AddIdData<[SV1<number>, SV2<number>], { name: 'bar', variant: 'num' }>;

export type CollectionEx = CollectionOf<FContracts> & CollectionOf<SContractsS> & CollectionOf<SContractsN>;

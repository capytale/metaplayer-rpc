type Test<A, B> = A extends B ? true : false;

type T = Test<
    (...args: string[]) => number,
    (...args: any[]) => unknown
>;

type Identified = { name: string, version: number };

type IdOf<T extends Identified> =
    T extends { variant: string } ?
    `${T['name']}(${T['variant']}):${T['version']}` :
    `${T['name']}:${T['version']}`;

type V1 = {
    version: 1;
    metaplayer: {
        ping(): 'pong';
    };
    application: {
        pong(): 'ping';
    };
}

type V2 = {
    version: 2;
    metaplayer: {
        hello(): 'world';
    }
    application: {
        pong(): 'ping';
    };
}

type V3 = {
    version: 3;
    metaplayer: {
        goodbye(): 'world';
    }
    application: {
        pong(): 'ping';
    };
}

import type { AddIdData, CollectionOf } from '..';
//[V1, V2, V3];
type Contracts = AddIdData<[V1, V2, V3], { name: 'test' }>;

export type Collection = CollectionOf<Contracts>;

export type C1 = Collection['test:1'];
export type C2 = Collection['test:2'];
export type C3 = Collection['test:3'];

import type { Provider } from '..';

type MP = Provider<Collection, 'test:2', 'metaplayer'>;
type AP = Provider<Collection, 'test:1', 'application'>;

const mp: MP = {
    name: 'test',
    version: 2,
    hello: () => Promise.resolve('world')
}

const ap: AP = {
    name: 'test',
    version: 1,
    pong: () => Promise.resolve('ping')
}
type FV1 = {
    version: 1;
    metaplayer: {
        /**
         * La méthode ping de la version 1
         * 
         * @param echo faut-il logger ?
         * @returns "pong"
         */
        ping(echo: boolean): 'pong';
    };
    application: {
        /**
         * La méthode pong de la version 1
         * 
         * @returns "ping"
         */
        pong(): 'ping';
    };
}

type FV2 = {
    version: 2;
    metaplayer: {
        /**
         * La méthode ping de la version 2
         * 
         * @param echo faut-il logger ?
         * @returns "pong"
         */
        ping(echo: boolean): 'pong';
        /**
         * La méthode hello de la version 2
         * 
         * @returns "world"
         */
        hello(): 'world';
    }
    application: {
        /**
         * La méthode pong de la version 2
         * 
         * @returns "ping"
         */
        pong(): 'ping';
    };
}

type FV3 = {
    version: 3;
    metaplayer: {
        /**
         * La méthode ping de la version 3
         * 
         * @param echo faut-il logger ?
         * @returns "pong"
         */
        ping(echo: boolean): 'pong';
        /**
         * La méthode hello de la version 3
         * 
         * @returns "world"
         */
        hello(): 'world';
    }
    application: {
        /**
         * La méthode pong de la version 3
         * 
         * @returns "ping"
         */
        pong(): 'ping';
        /**
         * La méthode goodbye de la version 3
         * 
         * @returns "world"
         */
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
type SContractsS = AddIdData<[SV1<string>, SV2<string>], { name: 'bar(text)' }>;
type SContractsN = AddIdData<[SV1<number>, SV2<number>], { name: 'bar(num)' }>;

export type CollectionEx = CollectionOf<FContracts> & CollectionOf<SContractsS> & CollectionOf<SContractsN>;

import { expect, test } from 'vitest';

import { type Socket, createSocket } from '../src';
import type { CollectionEx } from '@capytale/contract-type/test/example';
import { createLinks } from './link-mock';

test('proxy', async () => {
    const [mpLink, appLink] = createLinks();
    const mpSocket = createSocket(mpLink) as Socket<CollectionEx, 'metaplayer'>;
    const appSocket = createSocket(appLink) as Socket<CollectionEx, 'application'>;

    expect(mpSocket).toBeDefined();
    expect(appSocket).toBeDefined();

    let value2p;
    mpSocket.plug(['foo:1'] as const, ([foo]) => {
        return [
            {
                ping(echo) {
                    return 'pong' as const;
                }
            }
        ]
    });

    let value;
    appSocket.plug(['foo:3', 'bar(num):1'] as const, ([foo, bar]) => {
        return [
            {
                pong() {
                    return 'ping' as const;
                },
                goodbye() {
                    return 'world' as const;
                },
            },
            {
                async put(v) {
                    value = v + await bar.i.get();
                },
            }
        ]
    });

    mpSocket.plug(['bar(num):1'] as const, ([bar]) => {
        return [
            {
                get() {
                    return 1;
                },
            }
        ]
    });

    const [appFooLazy, appBarLazy] = mpSocket.get(['foo', 'bar(num)'] as const);
    expect(appFooLazy).toBeDefined();
    expect(appBarLazy).toBeDefined();

    const appFoo = await appFooLazy.promise;
    expect(appFoo).toBeDefined();
    expect(appFoo.version).toBe(3);
    expect(appFoo.i).toBeDefined();

    const ret = await appFoo.i.pong();
    expect(ret).toBe('ping');

    const ret2 = await appFoo.v(3)?.goodbye();
    expect(ret2).toBe('world');

    const appBar = await appBarLazy.promise;
    await appBar.i.put(20);
    expect(value).toBe(21);
});

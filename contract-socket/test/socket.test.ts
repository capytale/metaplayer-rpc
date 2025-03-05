import { expect, test } from 'vitest';

import { type Socket, createSocket } from '../src';
import type { ExampleCollection } from '@capytale/contract-builder/example';
import { createLinks } from './link-mock';
import { createPromiseCompletionSource, waitPromise } from './promise-completion-source';

test(
    'socket: deux contrats avec une implémentation réciproque',
    async () => {
        const [mpLink, appLink] = createLinks();
        const mpSocket = createSocket(mpLink) as Socket<ExampleCollection, 'metaplayer'>;
        const appSocket = createSocket(appLink) as Socket<ExampleCollection, 'application'>;

        expect(mpSocket).toBeDefined();
        expect(appSocket).toBeDefined();

        let mpFactDone1 = false;

        mpSocket.plug(
            ['foo:1'],
            ([foo]) => {
                mpFactDone1 = true;
                return [
                    // implementation de 'foo:1'
                    {
                        ping(echo) {
                            return 'pong' as const;
                        }
                    }
                ]
            });

        // wait 0,1 second
        await waitPromise(100);

        expect(mpFactDone1).toBe(false);

        let value;
        let appfactDone = false;
        appSocket.plug(
            ['foo:3', 'bar(num):1'],
            ([foo, bar]) => {
                appfactDone = true;
                return [
                    // implementation de 'foo:3'
                    {
                        pong() {
                            return 'ping' as const;
                        },
                        goodbye() {
                            return 'world' as const;
                        },
                    },
                    // implementation de 'bar(num):1'
                    {
                        async put(v) {
                            value = v + await bar.i!.get();
                        },
                    }
                ]
            });

        // wait 0,1 second
        await waitPromise(100);

        expect(appfactDone).toBe(false);

        let mpFactDone2 = false;

        mpSocket.plug(
            ['bar(num):1'],
            ['foo'],
            ([bar], [foo]) => {
                mpFactDone2 = true;
                return [
                    // implementation de 'bar(num):1'
                    {
                        async get() {
                            return (await foo.i!.pong()).length;
                        },
                    }
                ]
            });

        // wait 0,1 second
        await waitPromise(100);

        expect(mpFactDone1).toBe(true);
        expect(mpFactDone2).toBe(true);
        expect(appfactDone).toBe(true);

        const [appFooLazy, appBarLazy] = mpSocket.get(['foo', 'bar(num)']);
        expect(appFooLazy).toBeDefined();
        expect(appBarLazy).toBeDefined();

        const appFoo = await appFooLazy.promise;
        expect(appFoo).toBeDefined();
        expect(appFoo.version).toBe(3);
        expect(appFoo.i).toBeDefined();

        const ret = await appFoo.i!.pong();
        expect(ret).toBe('ping');

        const ret2 = await appFoo.v(3)?.goodbye();
        expect(ret2).toBe('world');

        const appBar = await appBarLazy.promise;
        await appBar.i!.put(20);
        expect(value).toBe(24);

        const [promise, resolve] = createPromiseCompletionSource();
        appSocket.use(
            ['bar(num)'],
            async ([bar]) => {
                resolve(await bar.i!.get());
            });
        expect(await promise).toBe(4);
    }
);

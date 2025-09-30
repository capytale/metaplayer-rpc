import { expect, test } from 'vitest';

import {
    type appImplementations,
    type mpImplementations,
    type appImplementation,
    type mpImplementation,
    createSockets
} from './socket-base';
import { createPromiseCompletionSource, waitPromise } from './promise-completion-source';

test(
    'socket: test plug simplifié',
    async () => {
        const [mpSocket, appSocket] = createSockets();

        expect(mpSocket).toBeDefined();
        expect(appSocket).toBeDefined();

        let mpFactDone1 = false;

        const fooImpl: mpImplementation<'foo:1'> = {
            // implementation de 'foo:1'
            ping(echo) {
                return 'pong';
            }
        };

        mpSocket.plug(
            'foo:1',
            (foo) => {
                mpFactDone1 = true;
                return fooImpl;
            });

        // wait 0,1 second
        await waitPromise(100);

        expect(mpFactDone1).toBe(false);

        let value;
        let appfactDone = false;
        appSocket.plug(
            'foo:3',
            (foo) => {
                return {
                    pong() {
                        return 'ping' as const;
                    },
                    goodbye() {
                        return 'world' as const;
                    },
                } satisfies appImplementation<'foo:3'>;
            });

        appSocket.plug(
            'bar(num):1',
            (bar) => {
                appfactDone = true;
                return {
                    async put(v) {
                        value = v + await bar.i!.get();
                    },
                } satisfies appImplementation<'bar(num):1'>;
            });


        // wait 0,1 second
        await waitPromise(100);

        expect(appfactDone).toBe(false);

        let mpFactDone2 = false;

        mpSocket.plug(
            'bar(num):1',
            ['foo'],
            (bar, [foo]) => {
                mpFactDone2 = true;
                return {
                    async get() {
                        return (await foo.i!.pong()).length;
                    },
                } satisfies mpImplementation<'bar(num):1'>;
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
            'bar(num)',
            async (bar) => {
                resolve(await bar.i!.get());
            });
        expect(await promise).toBe(4);
    }
);

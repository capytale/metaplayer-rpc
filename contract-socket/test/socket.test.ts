import { expect, test } from 'vitest';

import { type Socket, createSocket } from '../src';
import type { ExampleCollection } from '@capytale/contract-type/example';
import { createLinks } from './link-mock';

test(
    'socket: deux contrats avec une implémentation réciproque',
    async () => {
        const [mpLink, appLink] = createLinks();
        const mpSocket = createSocket(mpLink) as Socket<ExampleCollection, 'metaplayer'>;
        const appSocket = createSocket(appLink) as Socket<ExampleCollection, 'application'>;

        expect(mpSocket).toBeDefined();
        expect(appSocket).toBeDefined();

        mpSocket.plug(
            ['foo:1'],
            ([foo]) => {
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
        await new Promise(resolve => setTimeout(resolve, 100));

        let value;
        appSocket.plug(
            ['foo:3', 'bar(num):1'],
            ([foo, bar]) => {
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
        await new Promise(resolve => setTimeout(resolve, 100));

        mpSocket.plug(
            ['bar(num):1'],
            ['foo'],
            ([bar], [foo]) => {
                return [
                    // implementation de 'bar(num):1'
                    {
                        async get() {
                            return (await foo.i!.pong()).length;
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

        const ret = await appFoo.i!.pong();
        expect(ret).toBe('ping');

        const ret2 = await appFoo.v(3)?.goodbye();
        expect(ret2).toBe('world');

        const appBar = await appBarLazy.promise;
        await appBar.i!.put(20);
        expect(value).toBe(24);

        let resolve: any;
        const promise = new Promise<number>(r => resolve = r);
        appSocket.use(
            ['bar(num)'],
            async ([bar]) => {
                resolve(await bar.i!.get());
            });
        expect(await promise).toBe(4);
    }
);

test(
    'socket: utilisation d\'un contrat sans implémentation réciproque',
    async () => {
        const [mpLink, appLink] = createLinks();
        const mpSocket = createSocket(mpLink) as Socket<ExampleCollection, 'metaplayer'>;
        const appSocket = createSocket(appLink) as Socket<ExampleCollection, 'application'>;
        let resolve: any;
        const promise = new Promise<string>(r => resolve = r);
        appSocket.use(
            ['foo'],
            async ([foo]) => {
                resolve(await foo.i!.ping(true));
            });

        // wait 0,1 second
        await new Promise(resolve => setTimeout(resolve, 100));

        mpSocket.plug(
            ['foo:1'],
            ([foo]) => {
                return [
                    // implementation de 'foo:1'
                    {
                        ping(echo) {
                            return 'pong' as const;
                        }
                    }
                ]
            });


        expect(await promise).toBe('pong');
    }
);

test(
    'socket: test de plugsDone',
    async () => {
        const [mpLink, appLink] = createLinks();
        const mpSocket = createSocket(mpLink) as Socket<ExampleCollection, 'metaplayer'>;
        const appSocket = createSocket(appLink) as Socket<ExampleCollection, 'application'>;
        let value;
        appSocket.plug(
            ['foo:3', 'bar(num):1'],
            ([foo, bar]) => {
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
                        put(v) {
                            value = v + foo.version;
                        },
                    }
                ]
            });


        mpSocket.use(
            ['bar(num)'],
            ([bar]) => {
                bar.i!.put(20);
            });

        // wait 0,1 second
        await new Promise(resolve => setTimeout(resolve, 100));

        expect(value).toBeUndefined();

        mpSocket.plugsDone();

        // wait 0,1 second
        await new Promise(resolve => setTimeout(resolve, 100));

        expect(value).toBe(20);
    }
);

test(
    'socket: test de plugsDone (bis)',
    async () => {
        const [mpLink, appLink] = createLinks();
        const mpSocket = createSocket(mpLink) as Socket<ExampleCollection, 'metaplayer'>;
        const appSocket = createSocket(appLink) as Socket<ExampleCollection, 'application'>;

        let value1;
        appSocket.use(
            ['foo', 'baz(num)'],
            ([foo, baz]) => {
                value1 = foo.version + ' ' + baz.version;
            });

        let value2;
        mpSocket.use(
            ['bar(text)'],
            ([bar]) => {
                value2 = '' + bar.version;
            });

        // wait 0,1 second
        await new Promise(resolve => setTimeout(resolve, 100));

        expect(value1).toBeUndefined();
        expect(value2).toBeUndefined();

        mpSocket.plugsDone();

        // wait 0,1 second
        await new Promise(resolve => setTimeout(resolve, 100));

        expect(value1).toBe('0 0');
        expect(value2).toBeUndefined();

        appSocket.plugsDone();

        // wait 0,1 second
        await new Promise(resolve => setTimeout(resolve, 100));

        expect(value2).toBe('0');
    }
);

test(
    'socket: dépendances circulaires entre contrats',
    async () => {
        const [mpLink, appLink] = createLinks();
        const mpSocket = createSocket(mpLink) as Socket<ExampleCollection, 'metaplayer'>;
        const appSocket = createSocket(appLink) as Socket<ExampleCollection, 'application'>;

        appSocket.plug(
            ['foo:1', 'baz(num):1'],
            ([foo, baz]) => {
                return [
                    // implementation de 'foo:1'
                    {
                        pong() {
                            return 'ping' as const;
                        },

                    },
                    // implementation de 'baz(num):1'
                    {
                        put(v) {
                            return;
                        },
                    }
                ]
            });

        mpSocket.plug(
            ['baz(num):1', 'bar(text):1'],
            ([baz, bar]) => {
                return [
                    // implementation de 'baz(num):1'
                    {
                        get() {
                            return 1;
                        }

                    },
                    // implementation de 'bar(text):1'
                    {
                        get() {
                            return '2';
                        }
                    }
                ]
            });

        appSocket.plug(
            ['bar(text):1', 'baz(text):1'],
            ([bar, baz]) => {
                return [
                    // implementation de 'bar(text):1'
                    {
                        put(v) {
                            return;
                        }
                    },
                    // implementation de 'baz(text):1'
                    {
                        put(v) {
                            return;
                        }
                    }
                ]
            });

        const [mpBazNum, mpBarText] = mpSocket.get(['baz(num)', 'bar(text)'] as const);
        const [appFoo, appBazNum, appBarText, appBazText] = appSocket.get(['foo', 'baz(num)', 'baz(text)', 'bar(text)'] as const);


        // wait 0,1 second
        await new Promise(resolve => setTimeout(resolve, 100));

        expect(appFoo.i).toBeUndefined();
        expect(mpBazNum.i).toBeUndefined();
        expect(appBazNum.i).toBeUndefined();
        expect(mpBarText.i).toBeUndefined();
        expect(appBarText.i).toBeUndefined();
        expect(appBazText.i).toBeUndefined();

        mpSocket.plug(
            ['baz(text):1', 'foo:1'],
            ([baz, foo]) => {
                return [
                    // implementation de 'baz(text):1'
                    {
                        get() {
                            return '1';
                        }
                    },
                    // implementation de 'foo:1'
                    {
                        ping() {
                            return 'pong' as const;
                        }
                    }
                ]
            });

        // wait 0,1 second
        await new Promise(resolve => setTimeout(resolve, 100));

        expect(appFoo.i).toBeDefined();
        expect(mpBazNum.i).toBeDefined();
        expect(appBazNum.i).toBeDefined();
        expect(mpBarText.i).toBeDefined();
        expect(appBarText.i).toBeDefined();
        expect(appBazText.i).toBeDefined();
    }
);

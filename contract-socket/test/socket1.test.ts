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
    'socket: deux contrats avec une implémentation réciproque',
    async () => {
        const [mpSocket, appSocket] = createSockets();

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
                ] satisfies mpImplementations<['foo:1']>;
            });

        // wait 0,1 second
        await waitPromise(100);

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
                ] satisfies appImplementations<['foo:3', 'bar(num):1']>;
            });

        // wait 0,1 second
        await waitPromise(100);

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
                ] satisfies mpImplementations<['bar(num):1']>;
            });

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


test(
    'socket: deux contrats et use avant plug',
    async () => {
        const [mpSocket, appSocket] = createSockets();

        expect(mpSocket).toBeDefined();
        expect(appSocket).toBeDefined();

        const [promise1, resolve1] = createPromiseCompletionSource();
        appSocket.use(
            ['bar(num)'],
            async ([bar]) => {
                resolve1(await bar.i!.get());
            });

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
                ] satisfies mpImplementations<['foo:1']>;
            });

        // wait 0,1 second
        await waitPromise(100);

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
                ] satisfies appImplementations<['foo:3', 'bar(num):1']>;
            });

        // wait 0,1 second
        await waitPromise(100);

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
                ] satisfies mpImplementations<['bar(num):1']>;
            });

        expect(await promise1).toBe(4);

        const [promise2, resolve2] = createPromiseCompletionSource();
        appSocket.use(
            ['bar(num)'],
            async ([bar]) => {
                resolve2(await bar.i!.get());
            });

        expect(await promise2).toBe(4);
    }
);

test(
    'socket: use multiples',
    async () => {
        const [mpSocket, appSocket] = createSockets();

        let value = 21;

        mpSocket.plug(
            ['bar(num):1'],
            ([bar]) => {
                return [
                    // implementation de 'bar(num):1'
                    {
                        async get() {
                            return value;
                        },
                    }
                ] satisfies mpImplementations<['bar(num):1']>;
            });

        mpSocket.plugsDone();
        appSocket.plugsDone();

        {
            const [promise, resolve] = createPromiseCompletionSource();
            appSocket.use(
                ['bar(num)'],
                async ([bar]) => {
                    resolve(await bar.i!.get());
                });
            expect(await promise).toBe(value);
        }
        // wait 0,1 second
        await waitPromise(100);

        {
            value = 42;
            const [promise, resolve] = createPromiseCompletionSource();
            appSocket.use(
                ['bar(num)'],
                async ([bar]) => {
                    resolve(await bar.i!.get());
                });
            expect(await promise).toBe(value);
        }

        {
            value = 84;
            const [promise, resolve] = createPromiseCompletionSource();
            appSocket.use(
                ['bar(num)'],
                async ([bar]) => {
                    resolve(await bar.i!.get());
                });
            expect(await promise).toBe(value);
        }
    }
);


test(
    'socket: utilisation d\'un contrat sans implémentation réciproque',
    async () => {
        const [mpSocket, appSocket] = createSockets();
        const [promise, resolve] = createPromiseCompletionSource();
        appSocket.use(
            ['foo'],
            async ([foo]) => {
                resolve(await foo.i!.ping(true));
            });

        // wait 0,1 second
        await waitPromise(100);

        // Pas d'implémentation de 'foo' côté application
        appSocket.plugsDone();

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
                ] satisfies mpImplementations<['foo:1']>;
            });
        mpSocket.plugsDone();

        expect(await promise).toBe('pong');
    }
);

test(
    'socket: test de plugsDone I',
    async () => {
        const [mpSocket, appSocket] = createSockets();
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
                ] satisfies appImplementations<['foo:3', 'bar(num):1']>;
            });


        mpSocket.use(
            ['bar(num)'],
            ([bar]) => {
                bar.i!.put(20);
            });

        // wait 0,1 second
        await waitPromise(100);

        expect(value).toBeUndefined();

        mpSocket.plugsDone();

        // wait 0,1 second
        await waitPromise(100);

        expect(value).toBe(20);
    }
);

test(
    'socket: test de plugsDone II',
    async () => {
        const [mpSocket, appSocket] = createSockets();

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
        await waitPromise(100);

        expect(value1).toBeUndefined();
        expect(value2).toBeUndefined();

        mpSocket.plugsDone();

        // wait 0,1 second
        await waitPromise(100);

        expect(value1).toBeUndefined();
        expect(value2).toBeUndefined();

        appSocket.plugsDone();

        // wait 0,1 second
        await waitPromise(100);

        expect(value1).toBe('0 0');
        expect(value2).toBe('0');
    }
);

test(
    'socket: test de plugsDone III',
    async () => {
        const [mpSocket, appSocket] = createSockets();

        mpSocket.plugsDone();

        mpSocket.use(
            [
                'bar(num)'
            ],
            ([
                bar
            ]) => {
                bar.i?.put(42);
            }
        )

        // wait 0,1 second
        await waitPromise(100);

        const [promise, resolve] = createPromiseCompletionSource();

        appSocket.plug(
            [
                'bar(num):1',
            ],
            ([
                bar
            ]) => {
                return [
                    // implementation de 'bar(num):1'
                    {
                        put(v: number) {
                            resolve(v);
                        },
                    },
                ] satisfies appImplementations<['bar(num):1']>;
            });

        appSocket.plug(
            [
                'foo:1',
            ],
            ([
                foo
            ]) => {
                return [
                    // implementation de 'foo:1'
                    {
                        pong() {
                            return 'ping' as const;
                        },
                    },
                ] satisfies appImplementations<['foo:1']>;
            });

        appSocket.plugsDone();

        // wait 0,1 second
        await waitPromise(100);
        expect(await promise).toBe(42);
    }
);

test(
    'socket: test de plugsDone IV',
    async () => {
        const [mpSocket, appSocket] = createSockets();

        appSocket.plugsDone();

        appSocket.use(
            [
                'foo'
            ],
            ([
                foo
            ]) => {
                
            }
        )

        // wait 0,1 second
        await waitPromise(100);

        mpSocket.plug(
            [
                'bar(num):1',
            ],
            ([
                bar
            ]) => {
                return [
                    // implementation de 'bar(num):1'
                    {
                        get() {
                            return 42;
                        },
                    },
                ] satisfies mpImplementations<['bar(num):1']>;
            });

        mpSocket.plug(
            [
                'foo:1',
            ],
            ([
                foo
            ]) => {
                return [
                    // implementation de 'foo:1'
                    {
                        ping() {
                            return 'pong' as const;
                        },
                    },
                ] satisfies mpImplementations<['foo:1']>;
            });

        mpSocket.plugsDone();
    }
);


test(
    'socket: test de plugsDone V',
    async () => {
        const [mpSocket, appSocket] = createSockets();

        appSocket.plugsDone();

        // wait 0,1 second
        await waitPromise(100);

        mpSocket.plug(
            [
                'bar(num):1',
            ],
            ([
                bar
            ]) => {
                return [
                    // implementation de 'bar(num):1'
                    {
                        get() {
                            return 42;
                        },
                    },
                ] satisfies mpImplementations<['bar(num):1']>;
            });

        mpSocket.plug(
            [
                'foo:1',
            ],
            ([
                foo
            ]) => {
                return [
                    // implementation de 'foo:1'
                    {
                        ping() {
                            return 'pong' as const;
                        },
                    },
                ] satisfies mpImplementations<['foo:1']>;
            });

        mpSocket.plugsDone();
    }
);



test(
    'socket: dépendances circulaires entre contrats',
    async () => {
        const [mpSocket, appSocket] = createSockets();

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
                ] satisfies appImplementations<['foo:1', 'baz(num):1']>;
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
                ] satisfies mpImplementations<['baz(num):1', 'bar(text):1']>;
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
                ] satisfies appImplementations<['bar(text):1', 'baz(text):1']>;
            });

        const [mpBazNum, mpBarText] = mpSocket.get(['baz(num)', 'bar(text)']);
        const [appFoo, appBazNum, appBarText, appBazText] = appSocket.get(['foo', 'baz(num)', 'baz(text)', 'bar(text)']);


        // wait 0,1 second
        await waitPromise(100);

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
                ] satisfies mpImplementations<['baz(text):1', 'foo:1']>;
            });

        // wait 0,1 second
        await waitPromise(100);

        expect(appFoo.i).toBeDefined();
        expect(mpBazNum.i).toBeDefined();
        expect(appBazNum.i).toBeDefined();
        expect(mpBarText.i).toBeDefined();
        expect(appBarText.i).toBeDefined();
        expect(appBazText.i).toBeDefined();
    }
);

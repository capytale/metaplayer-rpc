import { expect, test } from 'vitest';

import { type Socket, createSocket } from '../src';
import type { ExampleCollection } from '@capytale/contract-builder/example';
import { createLinks } from './link-mock';
import { createPromiseCompletionSource, waitPromise } from './promise-completion-source';

test(
    'socket: trois contrats avec une seule implémentation réciproque',
    async () => {
        const [mpLink, appLink] = createLinks();
        const mpSocket = createSocket(mpLink) as Socket<ExampleCollection, 'metaplayer'>;
        const appSocket = createSocket(appLink) as Socket<ExampleCollection, 'application'>;

        expect(mpSocket).toBeDefined();
        expect(appSocket).toBeDefined();

        mpSocket.plug(
            [
                'foo:1',
                'bar(num):1',
                'baz(num):1',
            ],
            ([
                foo,
                bar,
                baz,
            ]) => {
                return [
                    // implementation de 'foo:1'
                    {
                        ping(echo) {
                            return 'pong' as const;
                        }
                    },
                    // implementation de 'bar(num):1'
                    {
                        get() {
                            return 0;
                        }
                    },
                    // implementation de 'baz(num):1'
                    {
                        get() {
                            return 1;
                        }
                    },
                ]
            });

        // wait 0,1 second
        await waitPromise(100);
        mpSocket.plugsDone();

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
                ]
            });

        // wait 0,1 second
        await waitPromise(100);
        appSocket.plugsDone();

        const [promise, resolve] = createPromiseCompletionSource();

        mpSocket.use(
            [
                'foo',
                'bar(num)',
                'baz(num)',
            ],
            ([
                foo,
                bar,
                baz,
            ]) => {
                resolve([
                    foo.version,
                    bar.version,
                    baz.version,
                ]);
            });

        expect(await promise).toEqual([1, 0, 0]);
    }
);

test(
    'socket: trois contrats avec une seule implémentation réciproque (bis)',
    async () => {
        const [mpLink, appLink] = createLinks();
        const mpSocket = createSocket(mpLink) as Socket<ExampleCollection, 'metaplayer'>;
        const appSocket = createSocket(appLink) as Socket<ExampleCollection, 'application'>;

        expect(mpSocket).toBeDefined();
        expect(appSocket).toBeDefined();

        appSocket.plug(
            [
                'foo:2',
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
                ]
            });

        // wait 0,1 second
        await waitPromise(100);
        appSocket.plugsDone();

        mpSocket.plug(
            [
                'foo:1',
                'bar(num):1',
                'baz(num):1',
            ],
            ([
                foo,
                bar,
                baz,
            ]) => {
                return [
                    // implementation de 'foo:1'
                    {
                        ping(echo) {
                            return 'pong' as const;
                        }
                    },
                    // implementation de 'bar(num):1'
                    {
                        get() {
                            return 0;
                        }
                    },
                    // implementation de 'baz(num):1'
                    {
                        get() {
                            return 1;
                        }
                    },
                ]
            });

        // wait 0,1 second
        await waitPromise(100);
        mpSocket.plugsDone();

        const [promise, resolve] = createPromiseCompletionSource();

        mpSocket.use(
            [
                'foo',
                'bar(num)',
                'baz(num)',
            ],
            ([
                foo,
                bar,
                baz,
            ]) => {
                resolve([
                    foo.version,
                    bar.version,
                    baz.version,
                ]);
            });

        expect(await promise).toEqual([2, 0, 0]);
    }
);

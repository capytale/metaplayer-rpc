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
    'socket: test exec',
    async () => {
        const [mpSocket, appSocket] = createSockets();

        expect(mpSocket).toBeDefined();
        expect(appSocket).toBeDefined();

        const promise = mpSocket.exec('foo', async (foo) => { return `${foo.version}*${await foo.v(3)?.pong()}*` })

        mpSocket.plug(
            'foo:1',
            (foo) => {
                return {
                    // implementation de 'foo:1'
                    async ping(echo) {
                        if (await foo.i?.pong() !== 'ping') throw new Error('foo:1.ping failed');
                        return 'pong' as const;
                    }
                };
            });
        //mpSocket.plugsDone();

        // wait 0,1 second
        await waitPromise(100);

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
                };
            });
        //appSocket.plugsDone();

        // wait 0,1 second
        await waitPromise(100);

        expect(await appSocket.exec('foo', (foo) => { return foo.i?.ping(true) })).toBe('pong');
        expect(await promise).toBe('3*ping*');

        const r = await appSocket.exec('foo', (foo) => foo);
        expect(r.version).toBe(1);
    }
);

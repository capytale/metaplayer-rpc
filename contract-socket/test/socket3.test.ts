import { expect, test } from 'vitest';

import { type Socket, createSocket } from '../src';
import type { ExampleCollection } from '@capytale/contract-builder/example';
import { createLinks } from './link-mock';
import { createPromiseCompletionSource, waitPromise } from './promise-completion-source';

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


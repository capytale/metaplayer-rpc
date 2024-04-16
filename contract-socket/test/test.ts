import type { CollectionEx } from '@capytale/contract-type/test/example';
import type { Socket } from '..';

declare const socket: Socket<CollectionEx, 'application'>;

socket.plug(['foo:1', 'bar(num):1'] as const, ([f1, s2]) => {
    return [
        {
            pong(): "ping" {
                s2.v(1)?.get();
                return "ping";
            }
        },
        {
            put(v) {
                
            },
        }
    ]
});

socket.use(['foo', 'bar(num)'] as const, async ([f1, s2]) => {
    await f1.i.ping(true);
    await s2.i.get();
    f1.v(2)?.hello();
    if (f1.version === 2) {
        f1.i.hello();
    }
});

const [foo, bar] = socket.get(['foo', 'bar(num)'] as const);
foo.i?.ping(true);
foo.promise.then(f => {
    f.i.ping(true);
    f.v(2)?.hello();
});
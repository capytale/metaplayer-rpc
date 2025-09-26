import { createLinks } from "./link-mock";
import { type Socket, createSocket, Implementations, IdsOf, Provider } from '../src';
import type { ExampleCollection } from '@capytale/contract-builder/example';

export function createSockets() {
    const [mpLink, appLink] = createLinks();
    const mpSocket = createSocket(mpLink) as Socket<ExampleCollection, 'metaplayer'>;
    const appSocket = createSocket(appLink) as Socket<ExampleCollection, 'application'>;
    return [mpSocket, appSocket] as const;
}

export type mpImplementations<Ids extends IdsOf<ExampleCollection>[]> = Implementations<Ids, ExampleCollection, 'metaplayer'>;
export type mpImplementation<Id extends IdsOf<ExampleCollection>> = Provider<ExampleCollection, Id, 'metaplayer'>;
export type appImplementations<Ids extends IdsOf<ExampleCollection>[]> = Implementations<Ids, ExampleCollection, 'application'>;
export type appImplementation<Id extends IdsOf<ExampleCollection>> = Provider<ExampleCollection, Id, 'application'>;
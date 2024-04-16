import type { AddIdData, CollectionOf } from '../src';
import type { FooV1, FooV2, FooV3 } from '../example/foo';
import type { BarV1, BarV2 } from '../example/bar';

// Ajout des identifiants aux contrats
type FooContracts = AddIdData<[FooV1, FooV2, FooV3], { name: 'foo' }>;
type BarTextContracts = AddIdData<[BarV1<string>, BarV2<string>], { name: 'bar', variant: 'text' }>;
type BarNumContracts = AddIdData<[BarV1<number>, BarV2<number>], { name: 'bar', variant: 'num' }>;

// Création et exportation de la collection d'exemple
export type ExampleCollection =
    CollectionOf<FooContracts> &
    CollectionOf<BarTextContracts> &
    CollectionOf<BarNumContracts>;

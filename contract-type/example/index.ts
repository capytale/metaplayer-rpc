import type { AddIdData, CollectionOf } from '..';

// importation des contrats d'exemple
import type { FooV1, FooV2, FooV3 } from './foo';
import type { BarV1, BarV2 } from './bar';
import type { BazV1, BazV2 } from './baz';

// Ajout des identifiants aux contrats
type FooContracts = AddIdData<[FooV1, FooV2, FooV3], { name: 'foo' }>;
type BarTextContracts = AddIdData<[BarV1<string>, BarV2<string>], { name: 'bar', variant: 'text' }>;
type BarNumContracts = AddIdData<[BarV1<number>, BarV2<number>], { name: 'bar', variant: 'num' }>;
type BazTextContracts = AddIdData<[BazV1<string>, BazV2<string>], { name: 'baz', variant: 'text' }>;
type BazNumContracts = AddIdData<[BazV1<number>, BazV2<number>], { name: 'baz', variant: 'num' }>;

// Création et exportation de la collection d'exemple
export type ExampleCollection =
    CollectionOf<FooContracts> &
    CollectionOf<BarTextContracts> &
    CollectionOf<BarNumContracts> &
    CollectionOf<BazTextContracts> &
    CollectionOf<BazNumContracts>;

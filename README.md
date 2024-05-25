# Capytale : communications MetaPlayer <-> Application

Ce dépôt a pour but de standardiser les communications ayant lieu entre le *MetaPlayer* de Capytale et une *Application* tierce intégrée.  
Définitions :
- *MetaPlayer* : il s'agit de la page principale fournie par Capytale
- *Application* : l'outil intégré dans une iframe du MetaPlayer  

> Plus de détails : [Intégration d'une application en iframe](/doc/Integration-iframe.md)

Le *MetaPlayer* et l'*Application* doivent s'échanger des données. L'initiative d'un échange peut venir de l'un ou l'autre côté. Chacun expose donc à l'autre une interface de communication.

> Note: Les interfaces de communications qui ont été utilisées avant la standardisation sont disponibles dans [legacy-contracts](/capytale/legacy-contracts/).

## Contrat d'interface
La communication est basée sur des contrats d'interfaces écrits en typescript.  
Le paquet [@capytale/contract-type](/contract-type/) est un paquet purement typescript
qui définit la structure générale d'un *contrat*.
```typescript
/**
 * Un contrat d'interface est un ensemble de fonctions.
 */
type ContractInterface = {
  [key: string]: (...args: any[]) => unknown;
};
```
> L'appel distant d'une fonction est nécessairement **asynchrone** et la valeur de retour sera donc toujours obtenue par l’intermédiaire d'une **promesse**.
Néanmoins cela ne doit pas apparaître dans la signature des fonctions rédigées dans le contrat. La rédaction du contrat doit se focaliser sur le type de retour. L'indication typescript que ce retour est encapsulé dans une promesse sera automatiquement ajoutée à l'intention du code qui effectue l'appel distant.
```typescript
/**
 * Un contrat spécifie l'interface exposée par chaque partie.
 * Il est identifié par un nom et une version.
 */
type Contract = {
  name: string;
  version: number;
  metaplayer: ContractInterface;
  application: ContractInterface;
}
```
> La **version** est un nombre entier commençant à *1*. Lors de la communication, chaque partie est informée de la version implémentée par l'autre partie. Lorsque le contrat n'est pas implémenté, cela est indiqué par une version égale à *0*.  
> Lorsqu'il a été publié, un contrat ne devrait plus être modifié. Toute modification doit se traduire par la publication d'une nouvelle version.

Le type ```Contract``` est *abstrait*, il sert de norme mais n'a aucune vocation à être concrètement implémenté en tant que tel.
En réalité, il est utilisé via des [accès indexés](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html).

## Collection de contrats
L'ensemble des *contrats* disponibles sont regroupés dans une **collection** qui est aussi un type typescript *abstrait*.
```typescript
/**
 * Une collection de contrats.
 */
export type Collection = { [key: string]: Contract };
```
> La clef qui identifie un contrat au sein de la collection est un identifiant construit avec le nom et la version séparés par ':'. Par exemple "foo:1" pour la version 1 du contrat nommé *foo*.

Plusieurs contrats différents peuvent être utilisés conjointement pour une même intégration d'*Application*..

- Le paquet [@capytale/contract-builder](/contract-builder/) est un paquet purement typescript qui contient des types utilitaires pour simplifier la rédaction des contrats et leur regroupement en une collection.
- Le paquet [@capytale/contracts](/capytale/contracts/) est un paquet purement typescript qui définit la collections des contrats Capytale disponibles. Il a vocation à s'enrichir dès que de nouveaux besoins apparaissent. Il est [publié](https://www.npmjs.com/package/@capytale/contracts).

## Agent de communication
L'*agent* est ce qui permet d'établir la communication basée sur les contrats.
- Le *MétaPlayer* utilise [@capytale/mp-agent](/capytale/mp-agent/)
- L'*Application* utilise [@capytale/app-agent](/capytale/app-agent/)

L'agent se présente sous la forme d'un objet ```Socket``` qui dispose de méthodes pour :
- fournir l'implémentation d'un ou plusieurs contrats,
- consommer les interfaces réciproques exposées par l'autre partie.

L'interface de cet objet ```Socket``` est décrite [ici](/contract-socket/src/socket-type.ts).


> Une démo est proposée dans le dossier [demo/](/demo/)
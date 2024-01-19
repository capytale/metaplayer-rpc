## Description générale

Capytale dispose d'un environnement nommé MetaPlayer qui permet à une application tierce intégrée dans une iframe de disposer des fonctionnalités pédagogiques exposées par la page hôte. 

![metaplayer-iframe.png](/doc/assets/metaplayer-iframe.png)

Pour que l'intégration fonctionne, l'application tierce doit pouvoir fonctionner de manière complètement autonome (HTML+CSS+JS sans interaction avec un serveur) et proposer quelques fonctions décrites ci-dessous qui lui permettront de communiquer avec les éléments du MetaPlayer.

## Configuration particulière de l'application tierce

Pour éviter les doublons et optmiser l'espace, le bouton de sauvegarde, le titre de l'activité el son logo, qui seront déjà présents dans la barre bleue du MétaPlayer, doivent être supprimés dans l'application tierce intégrée.

L'application tierce doit pouvoir être chargée en français par défaut.

## Princpe de communication entre l'application et le MetaPlayer

La communication se fait par des appels RPC
https://github.com/microsoft/postmessage-rpc (serviceId : `capytale-player`)

Le MetaPlayer et l'application tierce s'exposent mutuellement des fonctions qui permettent d'effectuer les actions : 
- Indiquer un status ready lorsque l'application est chargée et prête à fonctionner
- Fournir le contenu enregistré en base
- Indiquer un état dirty
- Réclamer le contenu à enregistrer en base
- ...

![communications.png](/doc/assets/communications.png)

# Capytale : communications MetaPlayer <-> Application

- *MetaPlayer* : page principale fournie par Capytale
- *Application* : outil intégré dans une iframe du MetaPlayer

## Description générale
[Intégration d'une application en iframe](/doc/Integration-iframe.md)

## Communications distantes

### Interfaces de communication
> Dans la communication entre le *MetaPlayer* et l'*Application*, chaque partie doit disposer d'une interface pour lui permettre d'interagir à distance avec l'autre partie.  
> Un *contrat* spécifie l'interface exposée par chaque partie.  
> Le *type* de base d'un `Contract` est défini dans [contract/index.ts](/src/contract/index.ts).

### Une première version *basique* de `Contract`
> Cette version est définie dans [contract/basic.ts](/src/contract/basic.ts).

#### déroulement des échanges au chargement :
1. Le MetaPlayer se charge et met en place l'iframe contenant l'Application
1. L'Application se charge et, dès qu'elle est prête, appelle [`metaplayer.appReady()`](/src/contract/basic.ts#L23)
1. Le MetaPlayer appelle [`application.loadContent()`](/src/contract/basic.ts#L46) pour fournir le contenu (ipynb) à l'Application afin qu'elle l'affiche.

#### déroulement des échanges lors des modifications et sauvegardes :
1. Lorsque l'utilisateur effectue une modification, l'Application doit appeler [`metaplayer.contentChanged()`](/src/contract/basic.ts#L28). Le MetaPlayer peut alors afficher le signal de modifications non enregistrées.
1. Lorsque l'utilisateur souhaite sauvegarder, le MetaPlayer appelle [`application.getContent()`](/src/contract/basic.ts#L55) afin d'obtenir le contenu (ipynb) à sauvegarder. Lorsque le contenu est sauvegardé en backend, le MetaPlayer appelle [`application.contentSaved()`](/src/contract/basic.ts#L60) pour informer l'Application.

### Implémentation de la connection
> Le côté fournisseur d'une interface peut être synchrone ou asynchrone.  
> Le côté distant d'une interface est forcément asynchrone.  
> Ces deux variantes sont définies dans [connection/index.ts](/src/connection/index.ts).


Une implémentation basée sur la librairie [*@mixer/postmessage-rpc*](https://github.com/microsoft/postmessage-rpc) (Microsoft) est proposée dans le dossier [connection/postmessage-rpc/](/src/connection/postmessage-rpc/).

Une implémentation générique basée sur la librairie [*comlink*](https://github.com/GoogleChromeLabs/comlink) (GoogleChromeLabs) est proposée dans le dossier [connection/comlink/](/src/connection/comlink/).

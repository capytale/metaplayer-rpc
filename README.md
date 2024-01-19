# Capytale : communications MetaPlayer <-> Application

- *MetaPlayer* : page principale fournie par Capytale
- *Application* : outil intégré dans une iframe du MetaPlayer

## Description générale
[Intégration d'une application en iframe](/doc/Integration-iframe.md)

## Communications distantes

### Interfaces de communication
 Dans la communication entre le *MetaPlayer* et l'*Application*, chaque partie doit disposer d'une interface
 pour lui permettre d'interagir à distance avec l'autre partie.  
 Ces *contrats d'interfaces* sont définis dans [remoteInterfaces.ts](/src/remoteInterfaces.ts).

#### déroulement des échanges au chargement :
1. Le MetaPlayer se charge et met en place l'iframe contenant l'Application
1. L'Application se charge et, dès qu'elle est prête, appelle [`MetaPlayerConnection.appReady()`](/src/remoteInterfaces.ts#L56)
1. Le MetaPlayer appelle [`ApplicationConnection.loadContent()`](/src/remoteInterfaces.ts#L79) pour fournir le contenu (ipynb) à l'Application afin qu'elle l'affiche.

#### déroulement des échanges lors des modifications et sauvegardes :
1. Lorsque l'utilisateur effectue une modification, l'Application doit appeler [`MetaPlayerConnection.contentChanged()`](/src/remoteInterfaces.ts#L61). Le MetaPlayer peut alors afficher le signal de modifications non enregistrées.
1. Lorsque l'utilisateur souhaite sauvegarder, le MetaPlayer appelle [`ApplicationConnection.getContent()`](/src/remoteInterfaces.ts#L88) afin d'obtenir le contenu (ipynb) à sauvegarder. Lorsque le contenu est sauvegardé en backend, le MetaPlayer appelle [`ApplicationConnection.contentSaved()`](/src/remoteInterfaces.ts#L93) pour informer l'Application.



### Implémentation
Un exemple d'implémentation coté *Application* basé sur [*@mixer/postmessage-rpc*](https://github.com/microsoft/postmessage-rpc) est proposé dans [application.ts](/src/application.ts).


# @capytale/contracts : la collection des contrats *Capytale*

## [simple-content](src/simple-content.ts)
Un contrat pour gérer un contenu simple :
- un seul contenu
- le mode assignment est le même que le mode create c'est à dire que
le contenu initial pour l'élève est celui qui a été préparé par l'enseignant.

Existe en deux variantes :
- *simple-content(text)* - pour un contenu de type string
- *simple-content(json)* - pour un contenu de type objet sérialisable
> d'autres variantes sont envisageables
### déroulement des échanges au chargement :
1. Le MetaPlayer se charge et met en place l'iframe contenant l'Application
1. L'Application se charge. Elle branche son implémentation du contrat dès qu'elle est prête
1. Le MetaPlayer appelle [`application.loadContent()`](src/simple-content.ts#L37) pour fournir le contenu (par exemple ipynb) à l'Application afin qu'elle l'affiche.

### déroulement des échanges lors des modifications et sauvegardes :
1. Lorsque l'utilisateur effectue une modification, l'Application doit appeler [`metaplayer.contentChanged()`](src/simple-content.ts#L22). Le MetaPlayer peut alors afficher le signal de modifications non enregistrées.
1. Lorsque l'utilisateur souhaite sauvegarder, le MetaPlayer appelle [`application.getContent()`](src/simple-content.ts#L46) afin d'obtenir le contenu à sauvegarder. Lorsque le contenu est sauvegardé en backend, le MetaPlayer appelle [`application.contentSaved()`](src/simple-content.ts#L51) pour informer l'Application.


/**
 * Ce module définit le contrat d'échange des contenus.
 */

/**
 * Un contrat pour gérer un contenu simple :
 * - un seul contenu de type `T`
 * - le mode assignment est le même que le mode create c'est à dire que
 *   le contenu initial pour l'élève est celui qui a été préparé par l'enseignant.
 * 
 * @param T le type du contenu
 */
export type SimpleContentV1<T> = {
    version: 1;

    /**
     * L'interface qui expose le *MetaPlayer* à l'*Application*.
     */
    metaplayer: {
        /**
         * L'*Application* doit appeler cette méthode pour indiquer au *MetaPlayer* que le contenu 
         * a été modifié par l'utilisateur (permettant par exemple d'activer le bouton de sauvegarde 
         * dans le bandeau supérieur de Capytale).
         */
        contentChanged(): void;
    };

    /**
     * L'interface qui expose l'*Application* au *MetaPlayer*.
     * Les méthodes non implantées sont ignorées.
     */
    application: {
        /**
         * Le *MetaPlayer* appelle cette méthode après la souscription au contrat, pour transmettre
         * les données de l'activité à l'*Application*.
         * 
         * Si `content` est `null`, l'*Application* doit réinitialiser son contenu à la valeur par 
         * défaut initiale.
         * Si l'*Application* n'est pas en mesure de charger le contenu, elle doit lever une exeption.
         * 
         * @param content le contenu de l'activité
        */
        loadContent(content: T | null): void;

        /**
         * Le *MetaPlayer* appelle cette méthode pour récupérer les données de l'*Application*, 
         * lorsque l'utilisateur effectue une action demandant d'enregistrer des données sur 
         * Capyale (typiquement, cliquer sur le bouton Enregsitrer dans le bandeau supérieur).
         * 
         * L'*Application* peut retourner `null` si le contenu correspond à la valeur par défaut
         * initiale.
         * 
         * 
         * @returns le contenu de l'activité
         */
        getContent(): T | null;

        /**
         * Le *MetaPlayer* appelle cette méthode pour indiquer à l'*Application* que le contenu 
         * a été sauvegardé.
         */
        contentSaved(): void;
    };
}

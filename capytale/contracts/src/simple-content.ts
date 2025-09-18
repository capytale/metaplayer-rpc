/**
 * Ce module définit le contrat d'échange des contenus de l'activité.
 *
 *    - Les données peuvent être `null` lorsqu'aucune donnée n'existe pour l'activité, 
 *      côté Capytale (typiquement: au moment de la création de l'activité).
 *    - Les données pour une acivité doivent toujours être du même type, quel que soit 
 *      le mode utilisé (create, assignment, ...).
 *
 * Souscription avec `"simple-content({type}):{v}"`, où :
 *    - `{v}` est le numéro de version du contrat.
 *    - `{type}` est le type de données utilisées par l'*Application*. Peut être:
 *            json
 *            text
 */

/**
 * Un contrat pour gérer un contenu simple :
 * - un seul contenu de type `T|null`
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
     * Toutes les méthodes sont asynchrones.
     */
    application: {
        /**
         * Le *MetaPlayer* appelle cette méthode après la souscription au contrat, pour transmettre
         * les données de l'activité à l'*Application*.
         * 
         *     - Si `content` est `null`, l'*Application* doit initialiser son contenu à la valeur 
         *       par défaut initiale.
         *     - Si l'*Application* n'est pas en mesure de charger le contenu, elle doit lever une 
         *       exeption.
         * 
         * @param content le contenu de l'activité
        */
        loadContent(content: T | null): void;

        /**
         * Le *MetaPlayer* appelle cette méthode pour récupérer les données de l'*Application*, 
         * lorsque l'utilisateur effectue une action demandant d'enregistrer des données sur 
         * Capyale (typiquement, cliquer sur le bouton Enregsitrer dans le bandeau supérieur).
         * 
         * L'*Application* peut renvoyer `null` si le contenu correspond à la valeur par défaut
         * initiale.
         * 
         * @returns le contenu de l'activité
         */
        getContent(): T | null;

        /**
         * Le *MetaPlayer* appelle cette méthode pour indiquer à l'*Application* que le contenu 
         * a été sauvegardé, côté Capytale.
         *
         * Cette notification peut être utile à l'*Application* si elle gère des états `dirty` 
         * (données non enregistrées dans Capytale) pour éviter que l'utilisateur ne puisse faire 
         * certaines actions qui lui ferait perdre ces données par mégarde.
         *
         * Cette méthode n'est appelée que si la sauvegarde a été un succès.
         */
        contentSaved(): void;
    };
}

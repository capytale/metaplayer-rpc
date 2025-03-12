/**
 * Ce module définit le mécanisme de rechargement de l'iFrame:
 * 
 * Si l'*Application* n'est pas une SWA (Single Web App), il peut lui être nécessaire de changer de page
 * en cours d'utilisation. Dans ce cas, le *MetaPlayer* doit être notifié pour que l'iFrame soit détruite 
 * et reconstruite avec la nouvelle URL.
 * Ce contrat permet également de transmettre les informations sur le contenu actuel de l'*Application*
 * entre la page initiale et la nouvelle page, sans passer par le mécanisme de sauvegarde des contrats
 * de type `simple-content`.
 *
 * Souscription au contrat avec `reload:{v}`, où `{v}` est le numéro de version.
 */

/**
 * Un contrat pour gérer le rechargement de l'iFrame.
 */
export type ReloadV1 = {
    version: 1;

    /**
     * L'interface qui expose le *MetaPlayer* à l'*Application*.
     */
    metaplayer: {
        /**
         * L'*Application* peut appeler cette méthode pour demander un rechargement avec l'url
         * passée en argument.
         * 
         * - L'iFrame est détruite puis recréée avec la nouvelle adresse.
         * - Le *MetaPlayer* récupère un état (`state`) contenant toutes les données qui devront
         *   être ensuite passées à la nouvelle instance de l'*Application* (à minima, toutes les 
         *   données liée à l'activité en cours).
         * - Après chargement de la nouvelle page, l'*Application* souscrit aux différents contrats,
         * mais le *MetaPlayer* n'appellera _PAS_ la méthode `loadContent` : c'est la la méthode 
         * `reloaded` du présent contrat qui sera appelée à la place.
         * 
         * @param url l'URL à charger dans l'iFrame.
         *        Si `null`, l'URL actuelle est rechargée.
         *        ATTENTION: si la logique de l'*Application* repose sur des paramètres passés 
         *        via l'URL, ne pas oublier de les rajouter à cet argument.
         * 
         * @param state un état à transmettre à l'application après le rechargement.
         *        L'objet `state` doit être serializable avec JSON.stringify.
         * 
         */
        reload(url?: string | null, state?: any): void;
    };

    /**
     * L'interface qui expose l'*Application* au *MetaPlayer*.
     */
    application: {
        /**
         * Le *MetaPlayer* appelle cette méthode pour indiquer à l'*Application* qu'un
         * rechargement a eu lieu et lui passé le dernier état de l'*Ap^plication*.
         * Cette méthode est appelée en lieu et place de `loadContent`, suite à une
         * demande de rechargement.
         * 
         * @param state l'état que l'application a transmis lors de l'appel à `reload`.
         */
        reloaded(state: any): void;
    };
}

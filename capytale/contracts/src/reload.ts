/**
 * Ce module définit le mécanisme de rechargement de l'iFrame.
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
         *   être données ensuite à la nouvelle instance de l'*Application* (à minima, toutes les 
         *   données liée à l'activité en cours).
         * - Après rechargement, le *MetaPlayer* n'appellera _PAS_ la méthode `loadContent` de 
         *   du contrat de l'*Application*, mais la méthode `reloaded` du présent contrat.
         * 
         * @param url l'URL à charger dans l'iFrame.
         *            Si null, l'URL actuelle est rechargée.
         *            ATTENTION: si la logique de l'*Application* repose sur des paramètres passés 
         *            via l'URL, ne pas oublier de les rajouter.
         * 
         * @param state un état à transmettre à l'application après le rechargement.
         *        L'objet state doit être serializable avec JSON.stringify.
         * 
         */
        reload(url?: string | null, state?: any): void;
    };

    /**
     * L'interface qui expose l'*Application* au *MetaPlayer*.
     * Les méthodes non implantées sont ignorées.
     */
    application: {
        /**
         * Le *MetaPlayer* appelle cette méthode pour indiquer à l'*Application* qu'un
         * rechargement a eu lieu.
         * Cette méthode est appelée en lieu et place de `loadContent`, suite à une
         * demande de rechargement.
         * 
         * @param state l'état que l'application a transmis lors de l'appel à `reload`.
         */
        reloaded(state: any): void;
    };
}

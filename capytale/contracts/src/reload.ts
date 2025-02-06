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
         * L'*Application* peut appeler cette méthode pour demander un rechargement.
         * L'iFrame est détruite puis recréée.
         * 
         * @param url l'URL à charger dans l'iFrame.
         *            Si null, l'URL actuelle est rechargée.
         * 
         * @param state un état éventuel à transmettre à l'application après le rechargement.
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
         * rechargement a eu lieu.
         * 
         * @param state l'état que l'application a transmis lors de l'appel à `reload`.
         */
        reloaded(state: any): void;
    };
}

/**
 * Ce module définit un contrat d'échange des contenus.
 */

/**
 * Un contrat pour gérer un contenu séparé : le contenu de l'activité (côté prof) et le contenu de l'assignment
 * (côté élève) sont différents.
 *
 * @param TActivity le type du contenu de l'activité
 * @param TAssignment le type du contenu de l'assignment
 */
export type SeparateContentsV1<TActivity, TAssignment> = {
    version: 1;

    /**
     * L'interface qui expose le *MetaPlayer* à l'*Application*.
     */
    metaplayer: {
        /**
         * L'*Application* doit appeler cette méthode pour indiquer au *MetaPlayer* que le contenu a été modifié par l'utilisateur.
         */
        contentChanged(): void;
    };

    /**
     * L'interface qui expose l'*Application* au *MetaPlayer*.
     */
    application: {
        /**
         * Le *MetaPlayer* appelle cette méthode pour envoyer les données à l'*Application*.
         * 
         * @param content le contenu de l'activité
         * @param assignment le contenu de l'assignment
         *  undefined si le mode est "create" ou "view" (pas de copie élève)
         *  null si le mode est "assignment" ou "review" mais que la copie élève est vide
         *
        */
        loadContent(content: TActivity | null, assignment: TAssignment | null | undefined): void;

        /**
         * Dans le mode "create", le *MetaPlayer* appelle cette méthode pour récupérer les données prof
         * de l'*Application*.
         * 
         * L'*Application* peut retourner `null` si le contenu correspond à la valeur par défaut initiale.
         * 
         * @returns le contenu de l'activité
         */
        getActivityContent(): TActivity | null;

        /**
         * Dans les mode "assignment" et "review", le *MetaPlayer* appelle cette méthode pour récupérer les données
         * élève de l'*Application*.
         * 
         * L'*Application* peut retourner `null` si le contenu correspond à la valeur par défaut initiale.
         * 
         * @returns le contenu de l'assignment
         */
        getAssignmentContent(): TAssignment | null;

        /**
         * Le *MetaPlayer* appelle cette méthode pour indiquer à l'*Application* que le contenu a été sauvegardé.
         */
        contentSaved(): void;
    };
}

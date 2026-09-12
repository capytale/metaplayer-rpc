/**
 * Ce module définit la possibilité pour le Meta-player de prévisualiser une
 * activité du point de vue de l'élève.
 */

/**
 * Un contrat pour gérer la prévisualisation du point de vue de l'élève
 */
export type PreviewV1 = {
    version: 1;

    /**
     * L'interface qui expose le *MetaPlayer* à l'*Application*.
     */
    metaplayer: {
        /**
         * L'*Application* peut appeler cette méthode pour savoir s'il est en
         * cours de prévisualisation.
         * 
         * @returns true si en cours de prévisualisation, false sinon.
         */
        isPreviewing(): boolean;
    };

    /**
     * L'interface qui expose l'*Application* au *MetaPlayer*.
     */
    application: {
        /**
         * Le *MetaPlayer* appelle cette méthode pour démarrer la prévisualisation.
         * 
         * @returns true si le changement est possible, false sinon (dans ce cas
         * le MetaPlayer utilise la méthode du rechargement de l'appliation).
        */
        startPreview(): boolean;
        /**
         * Le *MetaPlayer* appelle cette méthode pour arrêter la prévisualisation
         * (si elle a pu démarrer avec startPreview précédemment).
        */
        stopPreview(): void;
    };
}

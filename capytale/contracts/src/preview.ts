/**
 * Un contrat pour gérer la prévisualisation du point de vue de l'élève
 *
 * Documentation : [
 * https://doctechcapytale-d4cb18.forge.apps.education.fr/capytale-metaplayer/02-contracts/#preview
 * ](https://doctechcapytale-d4cb18.forge.apps.education.fr/capytale-metaplayer/02-contracts/#preview)
 */
export type PreviewV1 = {
    version: 1;

    /**
     * L'interface qui expose le *MetaPlayer* à l'*Application*.
     */
    metaplayer: {
        /**
         * L'*Application* peut appeler cette méthode pour savoir si le mode de prévisualisation
         * est activé.
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
         * le MetaPlayer utilise la méthode du rechargement de l'application).
        */
        startPreview(): boolean;
        /**
         * Le *MetaPlayer* appelle cette méthode pour arrêter la prévisualisation
         * (si elle a pu démarrer avec startPreview précédemment).
        */
        stopPreview(): void;
    };
}

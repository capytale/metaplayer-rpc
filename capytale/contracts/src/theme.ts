/**
 * Ce module définit la transmission du thème d'affichage.
 */

/**
 * Un contrat pour gérer le thème d'affichage.
 */
export type ThemeV1 = {
    version: 1;
    /**
     * L'interface qui expose le *MetaPlayer* à l'*Application*.
    */
    metaplayer: {
        /**
         * L'*Application* peut appeler cette méthode pour connaître le thème actuel.
         * 
         * @returns null si le thème n'est pas défini.
         *          Sinon, le nom du thème actuel 'light' ou 'dark'.
         */
        getCurrentTheme(): string | null;
    };

    /**
     * L'interface qui expose l'*Application* au *MetaPlayer*.
     */
    application: {
        /**
         * Le *MetaPlayer* appelle cette méthode pour indiquer un changement de
         * thème à l'*Application*.
         * 
         * @param theme le nouveau thème à appliquer 'light' ou 'dark',
         *              null signifie que le thème n'est pas défini. 
        */
        setTheme(theme: string | null): void;
    };
}

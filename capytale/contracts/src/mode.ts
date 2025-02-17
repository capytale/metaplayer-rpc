/**
 * Ce module définit la transmission du mode de l'activité.
 */

type Mode =
    'create' |
    'assignment' |
    'review' |
    'view';

/**
 * Un contrat pour gérer le mode de l'activité.
 */
export type ModeV1 = {
    version: 1;

    /**
     * L'interface qui expose le *MetaPlayer* à l'*Application*.
     */
    metaplayer: {
        /**
         * L'*Application* peut appeler cette méthode pour connaître le mode actuel.
         * 
         * @returns le mode actuel.
         */
        getCurrentMode(): Mode;
    };

    /**
     * L'interface qui expose l'*Application* au *MetaPlayer*.
     */
    application: {
        /**
         * Le *MetaPlayer* appelle cette méthode pour indiquer le mode à l'*Application*.
         * Ne devrait être appelé qu'une seule fois.
         * 
         * @param mode le mode à appliquer. 
        */
        setMode(mode: Mode): void;
    };
}

/**
 * Ce module définit la transmission du mode de l'activité.
 *
 * Les modes peuvent être :
 *    - `"create"` - Pour un enseignant en train de créer/modifier une activité.
 *    - `"assignment"` - Pour un élève/participant en train d'effectuer le travail demandé.
 *    - `"review"` - Pour un enseignant regardant la copie d'un élève.participant (que la
 *                   copie soit finalisée ou non: voir le contrat `workflow`).
 *    - `"view"` - Pour un enseignant regardant une activité créée par un autre enseignant
 *                 depuis la bibliothèque d'activité de Capytale.
 *
 * Souscription avec `mode:{v}`, où `{v}` est le numéro de version du contrat.
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
     * Toutes les méthodes sont asynchrones.
     */
    application: {
        /**
         * Le *MetaPlayer* appelle systématiquement cette méthode pour indiquer le mode à l'*Application*
         * avant d'avoir appelé la méthode `loadContent` des contrats `simple-content`.
         * 
         * @param mode le mode utilisé actuellement pour l'activité. 
        */
        setMode(mode: Mode): void;
    };
}

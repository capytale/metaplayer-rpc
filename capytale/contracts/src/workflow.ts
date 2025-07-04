/**
 * Ce module définit la transmission de l'état actuel du workflow de la copie d'un 
 * élève/participant.
 * L'état workflow peut prendre l'une des valeurs suivantes :
 * 
 *    - `"current"`  - L'élève n'a pas encore rendu la copie.
 *    - `"finished"` - L'élève a rendu la copie : il ne peut plus la modifier (il peut encore
 *                     la consulter ou pas, selon le réglage du "mode d'accès" de l'activité,
 *                     dans les paramètres de l'activité).
 *    - `"corrected"` - L'enseignant a marqué la copie comme corrigée/évaluée.
 * 
 * Souscription avec `workflow:{v}`, où `{v}` est le numéro de version du contrat.
 */

type Workflow = 'current' | 'finished' | 'corrected';

/**
 * Un contrat pour gérer le workflow de l'assignment.
 */
export type WorkflowV1 = {
    version: 1;

    /**
     * L'interface qui expose le *MetaPlayer* à l'*Application*.
     */
    metaplayer: {
        /**
         * L'*Application* peut appeler cette méthode pour connaître le workflow actuel.
         * 
         * @returns le mode actuel.
         */
        getCurrentWorkflow(): Workflow;
    };

    /**
     * L'interface qui expose l'*Application* au *MetaPlayer*.
     * Toutes les méthodes sont asynchrones.
     */
    application: {
        /**
         * Le *MetaPlayer* appelle cette méthode pour indiquer le workflow à l'*Application*.
         * Cette méthode est appelée une première fois juste après un appel à `setMode` (si le contrat 
         * `mode` a été souscrit) pour indiqué l'état initial, puis elle est rappelée à chaque fois que 
         * l'état de la copie de l'élève/du participant est modifié.
         * 
         * @param workflow: la nouvelle valeur du workflow à appliquer. 
        */
        setWorkflow(wf: Workflow): void;
    };
}

/**
 * Ce module définit la transmission du workflow de l'assignment.
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
     */
    application: {
        /**
         * Le *MetaPlayer* appelle cette méthode pour indiquer le workflow à l'*Application*.
         * Peut être appelé plusieurs fois.
         * 
         * @param mode le mode à appliquer. 
        */
        setWorkflow(wf: Workflow): void;
    };
}

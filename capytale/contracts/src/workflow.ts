/**
 * Ce module définit la transmission du workflow de l'assignment.
 */

import type { Workflow } from "./types";

/**
 * Un contrat pour gérer le workflow de l'assignment.
 *
 * Documentation : [https://doctechcapytale-d4cb18.forge.apps.education.fr/capytale-metaplayer/02-contracts/#workflow](https://doctechcapytale-d4cb18.forge.apps.education.fr/capytale-metaplayer/02-contracts/#workflow)
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
         * @returns le workflow actuel.
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
         * @param mode le workflow à appliquer. 
        */
        setWorkflow(wf: Workflow): void;
    };
}

/**
 * Ajoute la possibilité pour l'application de basculer 'current' => 'finished'
 *
 * Documentation : [https://doctechcapytale-d4cb18.forge.apps.education.fr/capytale-metaplayer/02-contracts/#workflow](https://doctechcapytale-d4cb18.forge.apps.education.fr/capytale-metaplayer/02-contracts/#workflow)
 */
export type WorkflowV2 = {
    version: 2;

    /**
     * L'interface qui expose le *MetaPlayer* à l'*Application*.
     */
    metaplayer: {
        /**
         * L'*Application* peut appeler cette méthode pour connaître le workflow actuel.
         * 
         * @returns le workflow actuel.
         */
        getCurrentWorkflow(): Workflow;

        /**
         * Dans le mode 'assignment', l'*Application* peut appeller cette méthode pour demander
         * un changement de workflow.
         * Si le changement de workflow est accepté, le *MetaPlayer* appelle à son tour la
         * méthode `setWorkflow` de l'*Application*.
         * Sinon, une erreur est levée.
         * 
         * @param mode le workflow demandé.
        */
        changeWorkflow(wf: Workflow): void;
    };

    /**
     * L'interface qui expose l'*Application* au *MetaPlayer*.
     */
    application: {
        /**
         * Le *MetaPlayer* appelle cette méthode pour indiquer le workflow à l'*Application*.
         * Peut être appelé plusieurs fois.
         * 
         * @param mode le workflow à appliquer. 
        */
        setWorkflow(wf: Workflow): void;
    };
}

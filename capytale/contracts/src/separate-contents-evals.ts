/**
 * Ce module définit un contrat d'échange des contenus.
 */

import type { Evaluation } from "./types";

/**
 * Un contrat pour gérer un contenu séparé (comme separate-contents) et des évaluations :
 *
 * @param TActivity le type du contenu de l'activité
 * @param TAssignment le type du contenu de l'assignment
 *
 * Documentation : [https://doctechcapytale-d4cb18.forge.apps.education.fr/capytale-metaplayer/02-contracts/#separate-contents-eval](https://doctechcapytale-d4cb18.forge.apps.education.fr/capytale-metaplayer/02-contracts/#separate-contents-eval)
 */
export type SeparateContentsEvalV1<TActivity, TAssignment> = {
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
         * @param activity le contenu de l'activité
         * @param assignment le contenu de l'assignment
         *  undefined si le mode est "create" ou "view" (pas de copie élève)
         *  null si le mode est "assignment" ou "review" mais que la copie élève est vide
         *
        */
        loadContent(activity: TActivity | null, assignment: TAssignment | null | undefined): void;

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
         * @returns le contenu de l'assignment et les évaluations associées.
         */
        getAssignmentContent(): {
            content: TAssignment | null;
            evaluation?: Evaluation[];
        }

        /**
         * Le *MetaPlayer* appelle cette méthode pour indiquer à l'*Application* que le contenu a été sauvegardé avec succès.
         */
        contentSaved(): void;
    };
}

/**
 * Un contrat pour gérer un contenu séparé (comme separate-contents) et des évaluations :
 *
 * @param TActivity le type du contenu de l'activité
 * @param TAssignment le type du contenu de l'assignment
 *
 * Documentation : [https://doctechcapytale-d4cb18.forge.apps.education.fr/capytale-metaplayer/02-contracts/#separate-contents-eval](https://doctechcapytale-d4cb18.forge.apps.education.fr/capytale-metaplayer/02-contracts/#separate-contents-eval)
 */
export type SeparateContentsEvalV2<TActivity, TAssignment> = {
    version: 2;

    /**
     * L'interface qui expose le *MetaPlayer* à l'*Application*.
     */
    metaplayer: {
        /**
         * L'*Application* doit appeler cette méthode pour indiquer au *MetaPlayer* que le contenu a été modifié par l'utilisateur.
         */
        contentChanged(): void;

        /**
         * L'appel de cette méthode par l'*Application* déclenche l'enregistrement des données.
         * L'appel n'est possible qu'en mode *assignment*.
         * En réponse à cet appel, le *MetaPlayer* invoque ```getAssignmentContent()``` pour
         * récupérer les données à enregistrer.
         */
        saveAssignment(): void;
    };

    /**
     * L'interface qui expose l'*Application* au *MetaPlayer*.
     */
    application: {
        /**
         * Le *MetaPlayer* appelle cette méthode pour envoyer les données à l'*Application*.
         *
         * @param activity le contenu de l'activité
         * @param assignment le contenu de l'assignment
         *  undefined si le mode est "create" ou "view" (pas de copie élève)
         *  null si le mode est "assignment" ou "review" mais que la copie élève est vide
         *
        */
        loadContent(activity: TActivity | null, assignment: TAssignment | null | undefined): void;

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
         * @returns le contenu de l'assignment et les évaluations associées.
         */
        getAssignmentContent(): {
            content: TAssignment | null;
            evaluation?: Evaluation[];
        }

        /**
         * Le *MetaPlayer* appelle cette méthode pour indiquer à l'*Application* que le contenu a été sauvegardé avec succès.
         */
        contentSaved(): void;
    };
}

/**
 * Décrit les contrats d'interfaces entre le *MetaPlayer* Capytale
 * et l'*Application* MathALÉA
 */

/**
 * Format de donnée représentant une réponse à un exercice
 */
export type ExerciceGrade = {
    alea: string;
    answers: { [q: string]: string };
    bestScore: number;
    indice: number;
    numberOfPoints: number;
    numberOfQuestions: number;
    title: string;
    uuid: string;
}

/**
 * Version 1 du contract déjà en vigueur
 */
type ContractV1 = {
    /** identification du contrat */
    name: 'mathalea';
    version: 1;
    id: 'mathalea:1';

    /**
     * L'interface exposée par le *MetaPlayer* et consommée par l'*Application*.
     */
    metaplayer: {
        ping(): 'pong';

        /**
         * L'*Application* doit appeler la méthode `toolGetActivityParams` pour indiquer au *MetaPlayer*
         * qu'elle est prête et pour récupérer le contenu de l'activité.
        */
        toolGetActivityParams(): {
            // mode de l'activité
            mode: 'create' | 'assignment' | 'review';
            // workflow de l'activité
            // `undefined` en mode 'create'
            workflow?: 'current' | 'finished' | 'corrected';
            // La définition de l'activité.
            // `undefined` si l'activité est nouvelle.
            activity?: any;
            // Les réponses de l'élève.
            // `undefined` en mode 'create' ou s'il n'y a pas encore de réponse.
            studentAssignment?: ExerciceGrade[];
        };

        /**
         * L'*Application* doit appeler la méthode `hasChanged` pour indiquer au *MetaPlayer*
         * que le contenu a été modifié par l'utilisateur.
         * 
         * Ne devrait être appelée que si le mode est 'create'.
         */
        hasChanged(): void;

        /**
         * L'*Application* doit appeler la méthode `saveStudentAssignment` pour demander au *MetaPlayer*
         * de sauvegarder les réponses de l'élève.
         * 
         * Ne devrait être appelée que si le mode est 'assignment'.
         */
        saveStudentAssignment(data: {
            // Les réponses de l'élève
            // Le tableau fourni remplace complètement les réponses précédemment sauvegardées.
            studentAssignment: ExerciceGrade[];
            // L'évaluation totale
            evaluation: string;
            // L'index dans le tableau `studentAssignment` de l'exercice qui vient d'être soumis
            exerciceGraded?: number;
        }): void;
    };

    /**
     * L'interface exposée par l'*Application* et consommée par le *MetaPlayer*.
     */
    application: {
        ping(): 'pong';

        /**
         * Le *MetaPlayer* appelle la méthode `platformGetActivityParams` pour demander à l'*Application*
         * de lui fournir le contenu de l'activité.
         * 
         * Ne devrait être appelée que si le mode est 'create'.
         * 
         * @returns la définition de l'activité.
         */
        platformGetActivityParams(): any;
    };
}


/**
 * Version 2 du contract
 */
type ContractV2 = {
    /** identification du contrat */
    name: 'mathalea';
    version: 2;
    id: 'mathalea:2';

    /**
     * L'interface exposée par le *MetaPlayer* et consommée par l'*Application*.
     */
    metaplayer: {
        ping(): 'pong';

        /**
         * L'*Application* doit appeler la méthode `toolGetActivityParams` pour indiquer au *MetaPlayer*
         * qu'elle est prête et pour récupérer le contenu de l'activité.
        */
        toolGetActivityParams(): {
            // mode de l'activité
            mode: 'create' | 'assignment' | 'review';
            // workflow de l'activité
            // `undefined` en mode 'create'
            workflow?: 'current' | 'finished' | 'corrected';
            // La définition de l'activité.
            // `undefined` si l'activité est nouvelle.
            activity?: any;
            // Les réponses de l'élève.
            // `undefined` en mode 'create' ou s'il n'y a pas encore de réponse.
            studentAssignment?: ExerciceGrade[];
            // Des données globales concernant le travail de l'élève : temps passé, etc... Format à définir.
            // `undefined` en mode 'create' ou s'il n'y a pas encore de réponse.
            assignmentData?: any;
        };

        /**
         * L'*Application* doit appeler la méthode `hasChanged` pour indiquer au *MetaPlayer*
         * que le contenu a été modifié par l'utilisateur.
         * 
         * Ne devrait être appelée que si le mode est 'create'.
         */
        hasChanged(): void;

        /**
         * L'*Application* doit appeler la méthode `saveStudentAssignment` pour demander au *MetaPlayer*
         * de sauvegarder les réponses de l'élève.
         * 
         * Ne devrait être appelée que si le mode est 'assignment'.
         */
        saveStudentAssignment(data: {
            // Les réponses de l'élève
            // Le tableau fourni remplace complètement les réponses précédemment sauvegardées.
            studentAssignment: ExerciceGrade[];
            // L'évaluation totale
            evaluation: string;
            // L'index dans le tableau `studentAssignment` de l'exercice qui vient d'être soumis
            // 'all' pour indiquer que tous les exercices sont soumis
            exerciceGraded?: number | 'all';
            // Des données globales concernant le travail de l'élève : temps passé, etc... Format à définir.
            // Les données fournies remplacent complètement les données précédemment sauvegardées.
            assignmentData?: any;
            // Indique que l'activité est terminée et doit être verrouillée pour l'élève : workflow = 'finished'
            final?: boolean;
        }): void;
    };

    /**
     * L'interface exposée par l'*Application* et consommée par le *MetaPlayer*.
     * Pas de changement par rapport à la version 1.
     */
    application: {
        ping(): 'pong';

        /**
         * Le *MetaPlayer* appelle la méthode `platformGetActivityParams` pour demander à l'*Application*
         * de lui fournir le contenu de l'activité.
         * 
         * Ne devrait être appelée que si le mode est 'create'.
         * 
         * @returns la définition de l'activité.
         */
        platformGetActivityParams(): any;
    };
}

export type Contracts = [ContractV1, ContractV2];
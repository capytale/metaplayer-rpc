/**
 * Ce module définit le contrat d'échange des contenus.
 */

type NumericEvaluation = {
    score: number;
    scoreMax: number;
}

type StringEvaluation = {
    score: string;
}

type Evaluation = {
    evalLabel: string;
    evalTitle?: string;
    comment?: string;
    date?: Date | string;
} & (NumericEvaluation | StringEvaluation);


/**
 * Un contrat pour gérer un contenu simple :
 * - un seul contenu de type `T`
 * - le mode assignment est le même que le mode create c'est à dire que
 *   le contenu initial pour l'élève est celui qui a été préparé par l'enseignant.
 * 
 * @param T le type du contenu
 */
export type SimpleContentEvalV1<T> = {
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
         * Si `content` est `null`, l'*Application* doit réinitialiser son contenu à la valeur par défaut initiale.
         * Si l'*Application* n'est pas en mesure de charger le contenu, elle doit lever une exeption.
         * 
         * @param content le contenu de l'activité
        */
        loadContent(content: T | null): void;

        /**
         * Le *MetaPlayer* appelle cette méthode pour récupérer les données de l'*Application* dans le mode create.
         * 
         * L'*Application* peut retourner `null` si le contenu correspond à la valeur par défaut initiale.
         * 
         * @returns le contenu de l'activité
         */
        getContent(): T | null;

        /**
         * Le *MetaPlayer* appelle cette méthode pour récupérer les données de l'*Application* dans le mode assignment.
         * 
         * @returns l'état de la copie et les évaluations associées.
         */
        getAssignmentContent(): {
            content: T | null;
            evaluation?: Evaluation[];
        };

        /**
         * Le *MetaPlayer* appelle cette méthode pour indiquer à l'*Application* que le contenu a été sauvegardé.
         */
        contentSaved(): void;
    };
}

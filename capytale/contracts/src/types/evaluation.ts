interface BaseEvaluation<T = string | number> {
    /** Clé unique qui identifie l'item évalué */
    evalLabel: string;
    /** Intitulé de l'item évalué */
    evalTitle?: string;
    /** Commentaire de l'évaluation */
    comment?: string;
    /** Date de l'évaluation */
    date?: Date | string;
    /** Données supplémentaires optionnelles */
    data?: string;
    /** Score de l'évaluation, de type numérique ou chaîne de caractères */
    score: T;
    /** Score maximum, de type numérique. Doit être fourni si score est de type number */
    scoreMax?: T extends number ? number : never;
}

export type Evaluation = BaseEvaluation<number> | BaseEvaluation<string>;

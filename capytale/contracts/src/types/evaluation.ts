/**
 * Une évaluation regroupe les informations pour évaluer toute ou partie de l'activité en
 * cours (c'est à l'Application de gérer/décider de comment répartie les Evaluations dans
 * une activité. Elles sont différentiées par les identifiants `evalLabel`).
 *
 * Les champs `evalLabel: string` et `score` sont obligatoires. Le `score` peut être de
 * deux types :
 * - `score: number` : dans ce cas, le champ `scoreMax: number` est également requis.
 * - `score: string` : un message donnant l'évaluation. Le champ `scoreMax` ne doit alors
 * pas être utilisé.
 * */
export type Evaluation = BaseEvaluation<number> | BaseEvaluation<string>


type BaseEvaluation<T extends string | number> = {
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
} & (T extends number ? {
    /** Score maximum pour cette évaluation. */
    scoreMax: number
} : {
    scoreMax?: never
})

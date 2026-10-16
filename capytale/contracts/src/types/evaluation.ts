/**
 * Une évaluation regroupe les informations pour évaluer toute ou partie de l'activité en
 * cours (c'est à l'Application de gérer/décider de comment répartir les Evaluations dans
 * une activité).
 *
 * Documentation : [
 * https://doctechcapytale-d4cb18.forge.apps.education.fr/capytale-metaplayer/02-contracts/#evaluation
 * ](https://doctechcapytale-d4cb18.forge.apps.education.fr/capytale-metaplayer/02-contracts/#evaluation)
 */
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
} & (T extends number ? {
    /** Score de l'évaluation, de type numérique */
    score: number;
    /** Score maximum pour cette évaluation. */
    scoreMax: number;
} : {
    /** Score de l'évaluation sous forme de chaîne de caractères */
    score: string;
    scoreMax?: never;
})

// NOTE de Fred :
// Déclaration explicite des types pour `score` pour ne pas avoir du T qui apparaît dans la doc...
// Permet au moins un docstring spécifique à chaque version dans la doc (même si celui de la
// version string n'apparaît tjrs pas dans les infos-bulles d'autocomplétion... :rolleyes: )

// NOTES:
// 1) Le docstring du type `Evaluation` est utilisé pour générer la doc du MetaPlayer, en
//    supprimant systématiquement en début de ligne les caractères `/[\s*/]+/gm`.
// 2) Ne pas mettre ce commentaire au-dessus du docstring en question, sinon il va apparaître
//    dans la doc.

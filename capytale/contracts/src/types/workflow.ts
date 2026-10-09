/**
 * Les états possibles pour une activité/copie d'élève :
*
* - `'current'`: en cours, modifiable par un élève.
* - `'finished'`: rendue et bloquée côté élève (déblocable par l'enseignant).
* - `'corrected'`: rendue et marquée comme corrigée par l'enseignant.
*/
export type Workflow = 'current' | 'finished' | 'corrected';

// NOTES:
// 1) Le docstring ci-dessus est utilisé pour générer la doc du MetaPlayer, en supprimant
//    systématiquement en début de ligne les caractères `/[\s*/]+/gm`.
// 2) Ne pas mettre ce commentaire au-dessus du docstring en question, sinon il va apparaître
//    dans la doc.

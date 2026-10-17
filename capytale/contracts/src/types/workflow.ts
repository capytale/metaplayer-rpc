/**
 * Définis les états possibles pour le "flux de travail" d'une activité/copie d'élève :
*
* - `'current'`: en cours, modifiable par un élève.
* - `'finished'`: rendue et bloquée côté élève (déblocable par l'enseignant).
* - `'corrected'`: rendue et marquée comme corrigée par l'enseignant.
 *
 * Documentation : [
 * https://capytale.forge.apps.education.fr/doctechcapytale/capytale-metaplayer/02-contracts/#workflow
 * ](https://capytale.forge.apps.education.fr/doctechcapytale/capytale-metaplayer/02-contracts/#workflow)
 */
export type Workflow = 'current' | 'finished' | 'corrected';

// NOTES:
// 1) Le docstring ci-dessus est utilisé pour générer la doc du MetaPlayer, en supprimant
//    systématiquement en début de ligne les caractères `/[\s*/]+/gm`.
// 2) Ne pas mettre ce commentaire au-dessus du docstring en question, sinon il va apparaître
//    dans la doc.

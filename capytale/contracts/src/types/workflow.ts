/**
 * Les états possibles pour une activité/copie d'élève/apprenant.
 *
 * - `"current"`: en cours, modifiable par un élève.
 * - `"finished"`: rendue et bloquée côté élève.
 * - `"corrected"`: rendue et marquée comme corrigée par l'enseignant.
 */
export type Workflow = 'current' | 'finished' | 'corrected';

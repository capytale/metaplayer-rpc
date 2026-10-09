/**
 * Les modes de visualisation/utilisation possibles pour une activité dans Capytale :
 *
 * - `'create'` : création/modification (quand possible) de l'activité par l'enseignant.
 * - `'assignment'` : apprenant travaillant actuellement sur l'activité.
 * - `'review'` : enseignant relisant/corrigeant une copie d'élève .
 * - `'view'` : activité vue depuis la bibliothèque de Capytale.
 */
export type Mode =
    'create' |
    'assignment' |
    'review' |
    'view';

// NOTES:
// 1) Le docstring ci-dessus est utilisé pour générer la doc du MetaPlayer, en supprimant
//    systématiquement en début de ligne les caractères `/[\s*/]+/gm`.
// 2) Ne pas mettre ce commentaire au-dessus du docstring en question, sinon il va apparaître
//    dans la doc.


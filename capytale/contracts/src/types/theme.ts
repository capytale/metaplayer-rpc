/**
 * Définis les états possibles pour le theme (jour/nuit) de l'interface.
 *
 * Documentation : [
 * https://capytale.forge.apps.education.fr/doctechcapytale/capytale-metaplayer/02-contracts/#theme
 * ](https://capytale.forge.apps.education.fr/doctechcapytale/capytale-metaplayer/02-contracts/#theme)
 */
export type Theme = 'dark' | 'light';

// NOTES:
// 1) Le docstring ci-dessus est utilisé pour générer la doc du MetaPlayer, en supprimant
//    systématiquement en début de ligne les caractères `/[\s*/]+/gm`.
// 2) Ne pas mettre ce commentaire au-dessus du docstring en question, sinon il va apparaître
//    dans la doc.

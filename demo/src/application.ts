/**
 * Implémentation côté Application (qui tourne dans l'iframe)
 *
 * - Les comportements de l'Application devant déclencher des actions du côté du MetaPlayer
 *   utilisent l'interface du MetaPlayer (`mpSimpleContent`) fournie à la callback passée en
 *   argument à `socket.use`.
 * - Les comportements de l'Application en réaction aux actions du MetaPlayer sont fournies
 *   via la fonction `plug` (objet `exposedToMetaPlayer`).
 */

import './style.css';
import { getSocket, type Implementation } from "@capytale/app-agent";

/**Affiche du feedback dans la console du navigateur, pour visualiser ce que fait l'Application */
const log = (...msg: any[]) => console.log("[Application] -", ...msg);

const socket = getSocket();

// Activer pour pouvoir accéder à l'objet depuis la console du navigateur :
// (globalThis as any).appSocket = socket;


// Implémentation des comportements où l'Application envoie des instructions au MetaPlayer :
document.querySelector('#content')!.addEventListener('input', () => {
  socket.use('simple-content(text)', async (mpSimpleContent)=>{
    log("Signale une modification du contenu au MetaPlayer.")
    await mpSimpleContent.i.contentChanged();
  })
})


// Implémentation des comportements de l'Application qui répondent aux actions/demandes du MetaPlayer :
const exposedToMetaPlayer = {
  loadContent(c) {
    log("Le contenu provenant de Capytale est chargé.");
    (document.querySelector('#content') as HTMLTextAreaElement).value = c;
  },
  getContent() {
    log("Le MetaPlayer demande les contenus à enregistrer.")
    return (document.querySelector('#content') as HTMLTextAreaElement).value;
  },
  contentSaved() {
    /* La démo n'ayant pas le bouton de sauvegarde du MetaPlayer, cette fonction n'est jamais appelée:
       la fonction `getContent` ne fait que demander les contenus, ce n'est pas elle qui déclenche une
       sauvegarde côté Capytale. */
  },
} satisfies Implementation<'simple-content(text):1'>


// Mise en place des contrats (NOTA : on peut soit faire un appel à `socket.plug` par contrat à
// utiliser, soit travailler avec des tableaux pour chaque arguments, pour passer les noms des
// contrats et leurs implémentations respectives via un seul appel à `socket.plug`) :
socket.plug(
  'simple-content(text):1',
  (mpSimpleContent) => {
    log(`Le MetaPlayer implémente le service '${mpSimpleContent.name}:${mpSimpleContent.version}'`);
    return exposedToMetaPlayer;
  }
);

socket.plugsDone();   // Fin de mise en place des contrats

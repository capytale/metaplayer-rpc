/**
 * Implémentation côté Application (qui tourne dans l'iframe)
 *
 * - Les comportements de l'Application devant déclencher des actions du côté du Meta-Player
 *   utilisent l'interface du Meta-Player (`mpSimpleContent`) fournie à la callback passée en
 *   argument à `socket.use`.
 * - Les comportements de l'Application en réaction aux actions du Meta-Player sont fournies
 *   via la fonction `plug` (objet `exposedToMetaPlayer`).
 */

import './style.css';
import { getSocket, type Implementation } from "@capytale/app-agent";

/**Affiche du feedback dans la console du navigateur, pour visualiser ce que fait l'Application */
const log = (...msg: any[]) => console.log("[Application] -", ...msg);

const socket = getSocket();

// Activer pour pouvoir accéder à l'objet depuis la console du navigateur :
// (globalThis as any).appSocket = socket;


// Implémentation des comportements où l'Application envoie des instructions au Meta-Player :
document.querySelector('#content')!.addEventListener('input', () => {
  socket.use('simple-content(text)', async (mpSimpleContent)=>{
    log("Signale une modification du contenu au Meta-Player.")
    await mpSimpleContent.i.contentChanged();
  })
})


// Implémentation des comportements de l'Application qui répondent aux actions/demandes du Meta-Player :
const exposedToMetaPlayer = {
  loadContent(c) {
    log("Le contenu provenant de Capytale est chargé.");
    (document.querySelector('#content') as HTMLTextAreaElement).value = c;
  },
  getContent() {
    log("Le Meta-Player demande les contenus à enregistrer.")
    return (document.querySelector('#content') as HTMLTextAreaElement).value;
  },
  contentSaved() {
    log("Données sauvées avec succès par le Meta-Player.")
  }
} satisfies Implementation<'simple-content(text):1'>


// Mise en place des contrats (NOTA : on peut soit faire un appel à `socket.plug` par contrat à
// utiliser, soit travailler avec des tableaux pour chaque arguments, pour passer les noms des
// contrats et leurs implémentations respectives via un seul appel à `socket.plug`) :
socket.plug(
  'simple-content(text):1',
  (mpSimpleContent) => {
    log(`Le Meta-Player implémente le service '${mpSimpleContent.name}:${mpSimpleContent.version}'`);
    return exposedToMetaPlayer;
  }
);

socket.plugsDone();   // Fin de mise en place des contrats

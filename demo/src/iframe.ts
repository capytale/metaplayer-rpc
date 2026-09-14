/**
 * Implantation côté Application (qui tourne dans l'iframe)
 *
 * - Les réactions de l'Application aux actions déclenchées depuis le Meta-Player sont implantées
 *   dans la fonction `plug`.
 * - Les comportements de l'Application devant déclencher des actions côté Meta-Player sont ici
 *   également implantés dans `plug` (comparer à `main.ts`).
 */

import './style.css'

// import de l'agent application
import { getSocket, type Implementation } from "@capytale/app-agent";

const socket = getSocket();
// (globalThis as any).appSocket = socket;   // Activer si des problèmes de ramasse miettes se présentent...

const log = (...msg: any[]) => console.log("[Application] -", ...msg)


// Mise en place des contrats.
// On peut soit faire un appel à `socket.plug` par contrat à utiliser, soit travailler avec des tableaux
// à la place de chaque arguments, pour passer les noms des contrats et leurs implantations respectives
// via un seul appel à `socket.plug`.
socket.plug(
  'simple-content(text):1',
  (mpSimpleContent) => {
    log(`Le meta-player implémente le service '${mpSimpleContent.name}:${mpSimpleContent.version}'`);
    application2MetaPlayer(mpSimpleContent);
    return metaPlayer2Application();
  }
);
socket.plugsDone();   // Enregistrement terminé


/**
 * Comportements de l'application qui déclenchent des actions du côté du MetaPlayer.
 */
const application2MetaPlayer=(mpSimpleContent)=>{

  document.querySelector('#content')!.addEventListener('input', () => {
    log("Signale une modification du contenu au meta-player.")
    mpSimpleContent.i.contentChanged();
  })
}

/**
 * Renvoie l'implantation des comportements de l'application qui répondent aux actions/demandes du MetaPlayer.
 */
const metaPlayer2Application=()=>({
  loadContent(c) {
    log("Le contenu provenant de Capytale est chargé.");
    (document.querySelector('#content') as HTMLTextAreaElement).value = c;
  },
  getContent() {
    log("Le meta-player demande les contenus à enregistrer.")
    return (document.querySelector('#content') as HTMLTextAreaElement).value;
  },
  contentSaved() {
    log("Données sauvées avec succès par le meta-player.")
  }
} satisfies Implementation<'simple-content(text):1'>)
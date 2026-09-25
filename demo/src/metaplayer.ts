/**
 * Implémentation côté Meta-Player (= Capytale)
 *
 * - Les réactions du Meta-Player aux actions déclenchées depuis l'Application sont implantées
 *   dans la fonction `plug` (objet renvoyé par le second argument).
 * - Les comportements du Meta-Player devant déclencher des actions côté Application sont ici
 *   implantés dans `socket.use`.
 */

import './style.css'
import { getSocket, type Implementation } from "@capytale/mp-agent";

/** Affiche du feedback dans la console du navigateur, pour visualiser ce que fait le Meta-Player */
const log = (...msg: any[]) => console.log("[Meta-Player] -", ...msg)

/** Change l'état de la checkbox indiquant  */
const upToDate=(ok=true)=>{
  (document.querySelector('#contentChanged') as HTMLInputElement).checked = !ok;
}

// Simule le contenu de l'Application qui serait stocké sur le serveur de Capytale :
let content: string = 'Hello World from Meta-Player!';

const iframe = document.querySelector<HTMLIFrameElement>('#application')!;
const socket = getSocket(iframe);

// Activer pour pouvoir accéder à l'objet depuis la console du navigateur:
// (globalThis as any).mpSocket = socket;


// Comportements du Meta-Player déclenchant des actions du côté de l'Application :
// (la hiérarchie de `socket.use` et des `listeners` est inversée par rapport à `application.ts`,
// uniquement pour montrer que les deux approches sont utilisables. L'implémentation des objets
// `socket` reporte automatiquement l'application de la logique jusqu'à ce que l'implémentation
// provenant de l'Application soit disponible)
socket.use(
  'simple-content(text)',
  (appSimpleContent) => {

    document.querySelector('#getContentBtn')!.addEventListener('click', async () => {
      log('Demande les données à enregistrer à l\'Application');
      content = await appSimpleContent.i.getContent();
      log('content received : length =', content?.length);
      upToDate()
    });

    document.querySelector('#setContentBtn')!.addEventListener('click', async () => {
      log('Renvoie le contenu actuellement enregistré sur Capytale à l\'Application');
      await appSimpleContent.i.loadContent(content);
      upToDate()
    });

    // ... puis initialise l'Application avec le contenu de départ :
    log('Envoie le contenu initial à l\'Application');
    appSimpleContent.i.loadContent(content);
  });


  // Mise en place des contrats :
socket.plug(
  'simple-content(text):1',
  (appSimpleContent) => {
    log(`L'application implémente le service '${appSimpleContent.name}:${appSimpleContent.version}'`);

    // Comportements du Meta-Player en réaction aux actions déclenchées depuis de l'Application :
    return {
      contentChanged() {
        log(`Reçoit la notification de modification du contenu.`);
        upToDate(false);
      }
    } satisfies Implementation<'simple-content(text):1'>;
  }
);

socket.plugsDone()

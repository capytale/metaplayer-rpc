/**
 * Implantation côté Meta-Player (= Capytale)
 *
 * - Les réactions du Meta-Player aux actions déclenchées depuis l'Application sont implantées
 *   dans la fonction `plug`.
 * - Les comportements du Meta-Player devant déclencher des actions du côté de l'Application 
 *   sont ici implantés dans `socket.use` (comparer à `iframe.ts`).
 */

import './style.css'

// import de l'agent metaplayer
import { getSocket, type Implementation } from "@capytale/mp-agent";

const iframe = document.querySelector<HTMLIFrameElement>('#application')!;

const socket = getSocket(iframe);
// (globalThis as any).mpSocket = socket;   // Activer si des problèmes de ramasse miettes se présentent...

const log = (...msg: any[]) => console.log("[Meta-Player] -", ...msg)

// Simule le contenu qui serait enregistré sur le serveur de Capytale :
let content: string = 'Hello World from Meta-Player!';

// Marque les contenus comme "à jour" (checkbox dans l'interface du meta-player):
const upToDate=(state:boolean=true)=>{
  (document.querySelector('#contentChanged') as HTMLInputElement).checked = !state;
}

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

socket.use(
  'simple-content(text)',
  (appSimpleContent) => {
    // Met en place les comportements du Meta-Player déclenchant des actions du côté de l'Application...

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

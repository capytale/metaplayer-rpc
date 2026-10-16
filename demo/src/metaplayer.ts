/**
 * Implémentation côté MetaPlayer (= Capytale)
 *
 * - Les réactions du MetaPlayer aux actions déclenchées depuis l'Application sont implantées
 *   dans la fonction `plug` (objet renvoyé par le second argument).
 * - Les comportements du MetaPlayer devant déclencher des actions côté Application sont ici
 *   implantés dans `socket.use`.
 */

import './style.css'
import { getSocket, type Implementation } from "@capytale/mp-agent";

/** Affiche du feedback dans la console du navigateur, pour visualiser ce que fait le MetaPlayer */
const log = (...msg: any[]) => console.log("[MetaPlayer] -", ...msg)

/** Change l'état de la checkbox indiquant si le contenu dans l'application a été modifié par
 *  rapport à ce qui est "enregistré" côté MetaPlayer/Capytale. */
const upToDate=(ok=true)=>{
  (document.querySelector('#contentChanged') as HTMLInputElement).checked = !ok;
}

const SIMPLE_CONTENT = 'simple-content(text)'
// NOTA: Interpolation indispensable (ne marche pas avec concaténation):
const SIMPLE_CONTENT_V1 = `${ SIMPLE_CONTENT }:1`

// Simule le contenu de l'Application qui serait stocké sur le serveur de Capytale :
let content: string = 'Hello World from MetaPlayer!';

const iframe = document.querySelector<HTMLIFrameElement>('#application')!;
const socket = getSocket(iframe);

// Activer pour pouvoir accéder à l'objet depuis la console du navigateur:
// (globalThis as any).mpSocket = socket;


// Comportements du MetaPlayer déclenchant des actions du côté de l'Application :
// (la hiérarchie de `socket.use` et des `listeners` est inversée par rapport à `application.ts`,
// uniquement pour montrer que les deux approches sont utilisables. L'implémentation des objets
// `socket` reporte automatiquement l'application de la logique jusqu'à ce que l'implémentation
// provenant de l'Application soit disponible)
socket.use(
  SIMPLE_CONTENT,
  async (appSimpleContent) => {

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
    await appSimpleContent.i.loadContent(content);
  });


// Mise en place des contrats :
socket.plug(
  SIMPLE_CONTENT_V1,
  (appSimpleContent) => {
    log(`L'application implémente le service '${appSimpleContent.name}:${appSimpleContent.version}'`);

    // Comportements du MetaPlayer en réaction aux actions déclenchées depuis de l'Application :
    return {
      contentChanged() {
        log(`Reçoit la notification de modification du contenu.`);
        upToDate(false);
      }
    } satisfies Implementation<typeof SIMPLE_CONTENT_V1>;
  }
);

socket.plugsDone()

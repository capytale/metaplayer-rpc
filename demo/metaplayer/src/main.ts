import './style.css'

// import de la définition des contrats Capytale
import type { CapytaleContracts } from "@capytale/contracts";

// import de l'agent metaplayer
import { getSocket } from "@capytale/mp-agent";

const iframe = document.querySelector<HTMLIFrameElement>('#application')!;

const socket = getSocket<CapytaleContracts>(iframe);

(globalThis as any).mpSocket = socket;

socket.plug(
  ['simple-content(text):1'] as const,
  ([]) => {
    return [
      {
        contentChanged() {
          console.log('mp.contentChanged');
        }
      }
    ];
  });

let content: string | null = null;

socket.use(
  ['simple-content(text)'] as const,
  ([sc]) => {
    document.querySelector('#getContentBtn')!.addEventListener('click', async () => {
      content = await sc.i.getContent();
      console.log('content received : ', content?.length);
    });

    document.querySelector('#setContentBtn')!.addEventListener('click', async () => {
      await sc.i.loadContent(content);
    });
  });


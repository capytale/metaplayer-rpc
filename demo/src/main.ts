import './style.css'

// import de l'agent metaplayer
import { getSocket, type Implementation } from "@capytale/mp-agent";

const iframe = document.querySelector<HTMLIFrameElement>('#application')!;

const socket = getSocket(iframe);

(globalThis as any).mpSocket = socket;

const simpleContentImplementation = {
  contentChanged() {
    (document.querySelector('#contentChanged') as HTMLInputElement).checked = true;
  }
} satisfies Implementation<'simple-content(text):1'>;

socket.plug(
  'simple-content(text):1',
  (sc) => {
    console.log(`[Meta-Player] l'application implémente le service 'simple-content(text):${sc.version}'`);
    return simpleContentImplementation;
  });

let content: string | null = null;

socket.use(
  'simple-content(text)',
  (sc) => {
    document.querySelector('#getContentBtn')!.addEventListener('click', async () => {
      content = await sc.i.getContent();
      console.log('content received : ', content?.length);
    });

    document.querySelector('#setContentBtn')!.addEventListener('click', async () => {
      (document.querySelector('#contentChanged') as HTMLInputElement).checked = false;
      await sc.i.loadContent(content);
    });

    sc.i.loadContent('Hello World from Meta-Player!');
  });


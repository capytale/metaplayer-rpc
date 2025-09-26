import './style.css'

// import de l'agent metaplayer
import { getSocket, type Implementation } from "@capytale/mp-agent";

const iframe = document.querySelector<HTMLIFrameElement>('#application')!;

const socket = getSocket(iframe);

(globalThis as any).mpSocket = socket;

const simpleContentImplementation = {
  contentChanged() {
    console.log('mp.contentChanged');
  }
} satisfies Implementation<'simple-content(text):1'>;

socket.plug(
  ['simple-content(text):1'] as const,
  ([]) => {
    return [simpleContentImplementation];
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


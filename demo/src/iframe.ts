import './style.css'

// import de l'agent application
import { getSocket, type Implementation } from "@capytale/app-agent";

const socket = getSocket();

(globalThis as any).appSocket = socket;

socket.plug(
  'simple-content(text):1',
  (sc) => {
    console.log(`[Application] le meta-player implémente le service 'simple-content(text):${sc.version}'`);
    return {
        loadContent(c) {
          (document.querySelector('#content') as HTMLTextAreaElement).value = c;
        },
        getContent() {
          return (document.querySelector('#content') as HTMLTextAreaElement).value;
        },
        contentSaved() {

        }
      } satisfies Implementation<'simple-content(text):1'>;
  });

socket.use('simple-content(text)', (sc) => {
  document.querySelector('#content')!.addEventListener('input', () => {
    sc.i.contentChanged();
  });
});
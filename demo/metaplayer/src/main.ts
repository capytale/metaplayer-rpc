import './style.css'

import getSocket from "@capytale.fr/metaplayer-rpc/src/connection/comlink/metaplayer";
import type { Contract } from "@capytale.fr/metaplayer-rpc/src/contract/basic";

const iframe = document.querySelector<HTMLIFrameElement>('#application')!;

const socket = getSocket<Contract>(iframe);

const application = socket.application;

(globalThis as any).application = application;

socket.plug({
  ping() {
    console.log('mp.ping');
    return 'pong';
  },
  appReady(m) {
    console.log('mp.appReady()', m);
  },
  contentChanged() {
    console.log('mp.contentChanged');
  }
});

let content: string | null = null;

document.querySelector('#getContentBtn')!.addEventListener('click', async () => {
  content = await socket.application.getContent();
  console.log('content received : ', content?.length);
});

document.querySelector('#setContentBtn')!.addEventListener('click', async () => {
  await socket.application.loadContent('create', content);
});
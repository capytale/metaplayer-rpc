import './style.css'

import getSocket from "@capytale/metaplayer-rpc/connection/comlink/metaplayer";
import type { Contract } from "@capytale/metaplayer-rpc/contract/basic";

const iframe = document.querySelector<HTMLIFrameElement>('#application')!;

const socket = getSocket<Contract>(iframe);

const application = socket.application;

(globalThis as any).application = application;

let i = 0;

socket.plug({
  ping() {
    console.log('mp.ping');
    i = i === 5 ? 0 : i + 1;
    switch (i) {
      case 0:
        return 'pong';
        break;

      case 1:
        throw new Error("une erreur");
        break;

      case 2:
        return Promise.resolve('pong');
        break;

      case 3:
        return Promise.reject('une promesse rejetée');
        break;

      case 4:
        console.log('mp call app.ping()...');
        application.ping().then((r) => console.log('...mp called app.ping() and got', r));
        return 'pong';
        break;

      default:
        throw new Error("une erreur");
        break;
    }
  },
  appReady(m) {
    console.log('mp.appReady()', m);
  },
  contentChanged() {
    console.log('mp.contentChanged');
  }
});

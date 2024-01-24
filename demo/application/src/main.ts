import './style.css'

import getSocket from "@capytale.fr/metaplayer-rpc";
import type { Contract } from '@capytale.fr/metaplayer-rpc/dist/contract/basic';

const socket = getSocket<Contract>();

(globalThis as any).metaplayer = socket.metaplayer;

let content: string | null = null;

socket.plug({
  ping() {
    return 'pong';
  },

  loadContent(m, c) {
    content = c;
  },
  getContent() {
    return content;
  },
  contentSaved() {

  }
});

import './style.css'

// import de l'agent application
import { getSocket } from "@capytale/app-agent";

const socket = getSocket();

(globalThis as any).appSocket = socket;

let content: string | null = "toto";

socket.plug(
  ['simple-content(text):1'],
  ([sc]) => {
    return [
      {
        loadContent(c) {
          content = c;
        },
        getContent() {
          return content;
        },
        contentSaved() {

        }
      }
    ];
  });

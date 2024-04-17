import { createApplicationLink } from '@capytale/contract-link';
import { createSocket, type Socket } from '@capytale/contract-socket';
import type { Contracts } from '@capytale/contracts';

let socket: Socket<Contracts, 'application'> | undefined = undefined;

/**
 * @param mpOrigin L'origine du *MetaPlayer*.
 * @returns Le socket de l'*Application*.
 */
function getSocket(mpOrigin: string): Socket<Contracts, 'application'> {
    if (socket != null) return socket;
    socket = createSocket<Contracts, 'application'>(createApplicationLink(mpOrigin));
    return socket;
}

export { getSocket }
import { createApplicationLink } from '@capytale/contract-link';
import { createSocket, type Socket } from '@capytale/contract-socket';
import type { Collection } from '@capytale/contract-type';
import type { CapytaleContracts } from '@capytale/contracts';

let socket: Socket<any, 'application'> | undefined = undefined;

/**
 * Retourne le socket de l'*Application*.
 * 
 * @typeParam CC - La collection de contrats.
 * @param mpOrigin - L'origine du *MetaPlayer*.
 * @returns Le socket de l'*Application*.
 */
function getSocket<CC extends Collection = CapytaleContracts>(mpOrigin?: string): Socket<CC, 'application'> {
    if (socket != null) return socket;
    socket = createSocket<CC, 'application'>(createApplicationLink('app-agent', mpOrigin));
    return socket;
}

export { getSocket }

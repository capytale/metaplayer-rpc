import { createMetaplayerLink } from '@capytale/contract-link/lib/mp-link';
import { createSocket, type Socket } from '@capytale/contract-socket';
import type { Contracts } from '@capytale/contracts';

const socketSymbol = Symbol('socket');

/**
 * @param appIframe l'iFrame de l'*Application*.
 * @param appOrigin l'origine de l'*Application*.
 * @returns le socket du *MetaPlayer*.
 */
function getSocket(appIframe: HTMLIFrameElement, appOrigin?: string): Socket<Contracts, 'metaplayer'>;
function getSocket(appIframe: any, appOrigin?: string): Socket<Contracts, 'metaplayer'> {
    if (appIframe[socketSymbol] != null) return appIframe[socketSymbol];
    appIframe[socketSymbol] = createSocket<Contracts, 'metaplayer'>(createMetaplayerLink(appIframe, appOrigin));
    return appIframe[socketSymbol];
}

export { getSocket }
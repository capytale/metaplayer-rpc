import { createMetaplayerLink } from '@capytale/contract-link/lib/mp-link';
import { createSocket, type Socket } from '@capytale/contract-socket';
import type { Collection } from '@capytale/contract-type';

const socketSymbol = Symbol('socket');

/**
 * Retourne le socket du *MetaPlayer*.
 * 
 * @typeParam CC - La collection de contrats.
 * @param appIframe - l'iFrame de l'*Application*.
 * @param appOrigin - l'origine de l'*Application*.
 * @returns le socket du *MetaPlayer*.
 */
function getSocket<CC extends Collection>(appIframe: HTMLIFrameElement, appOrigin?: string): Socket<CC, 'metaplayer'>;
function getSocket<CC extends Collection>(appIframe: any, appOrigin?: string): Socket<CC, 'metaplayer'> {
    if (appIframe[socketSymbol] != null) return appIframe[socketSymbol];
    appIframe[socketSymbol] = createSocket<CC, 'metaplayer'>(createMetaplayerLink(appIframe, appOrigin));
    return appIframe[socketSymbol];
}

export { getSocket }
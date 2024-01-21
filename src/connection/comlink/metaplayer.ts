/**
 * Une proposition d'implémentaion du côté *MetaPlayer* de la communication basée sur *comlink*.
 * 
 * - fournit au *MetaPlayer* une interface distante avec l'*Application*
 * - permet au *MetaPlayer* d'exposer sa propre implémentaion à l'*Application*
 */

import { windowEndpoint, expose, wrap } from 'comlink';
import type { Endpoint } from 'comlink';

import type { Contract } from '../../contract';
import { MetaPlayerSocket, Provider } from '..';

type MetaPlayer<C extends Contract> = Provider<C['metaplayer']>;
type Application<C extends Contract> = MetaPlayerSocket<C>['application'];

const epSymbol = Symbol('endpoint');
const applicationSymbol = Symbol('application');
const pluggedSymbol = Symbol('plugged');

function getEndpoint(iframe: HTMLIFrameElement): Endpoint {
    if (iframe[epSymbol] != null) return iframe[epSymbol];
    if (iframe.contentWindow == null) throw new Error('Application could not be reached');
    iframe[epSymbol] = windowEndpoint(iframe.contentWindow);
    return iframe[epSymbol];
}

/**
 * @param iframe L'iframe de l'*Application*.
 * @returns Une instance de `Application` qui permet au *MetaPlayer* de communiquer avec l'*Application*.
 */
function getApplication<C extends Contract>(iframe: HTMLIFrameElement): Application<C> {
    if (iframe[applicationSymbol] != null) return iframe[applicationSymbol];
    const endpoint = getEndpoint(iframe);
    iframe[applicationSymbol] = wrap(endpoint);
    return iframe[applicationSymbol];
}

/**
 * Permet au *MetaPlayer* d'exposer sa propre implémentaion à l'*Application*.
 * Ne devrait être appelée qu'une seule fois.
 * 
 * @param iframe L'iframe de l'*Application*.
 * @param provider L'implémentation de l'interface `MetaPlayer` fournie par le *MetaPlayer*.
 */
function plug<C extends Contract>(iframe: HTMLIFrameElement, provider: MetaPlayer<C>): void {
    if (iframe[pluggedSymbol]) throw new Error('MetaPlayer already plugged');
    const endpoint = getEndpoint(iframe);
    expose(provider, endpoint);
    iframe[pluggedSymbol] = true;
}

/**
 * @param iframe L'iframe de l'*Application*.
 * @returns le socket du *MetaPlayer*.
 */
function getSocket<C extends Contract>(iframe: HTMLIFrameElement): MetaPlayerSocket<C> {
    getEndpoint(iframe);
    return {
        plug(provider: Provider<Contract['metaplayer']>): void { plug(iframe, provider); },
        get application() { return getApplication(iframe); },
    };
}

export default getSocket;

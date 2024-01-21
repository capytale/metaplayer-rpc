/**
 * Une proposition d'implémentaion du côté *MetaPlayer* de la communication basée sur @mixer/postmessage-rpc
 * 
 * - fournit au *MetaPlayer* une interface distante avec l'*Application*
 * - permet au *MetaPlayer* d'exposer sa propre implémentaion à l'*Application*
 */

import { RPC } from '@mixer/postmessage-rpc';

import type { Contract } from '../../contract/basic';
import { MetaPlayerSocket, Provider } from '..';

type MetaPlayer = Provider<Contract['metaplayer']>;
type Application = MetaPlayerSocket<Contract>['application'];

const rpcSymbol = Symbol('rpc');
const applicationSymbol = Symbol('application');
const pluggedSymbol = Symbol('plugged');

function getRpc(iframe: HTMLIFrameElement): RPC {
    if (iframe[rpcSymbol] != null) return iframe[rpcSymbol];
    if (iframe.contentWindow == null) throw new Error('Application could not be reached');
    iframe[rpcSymbol] = new RPC({
        target: iframe.contentWindow,
        serviceId: 'capytale-player',
    });
    return iframe[rpcSymbol];
}

/**
 * @param iframe L'iframe de l'*Application*.
 * @returns Une instance de `Application` qui permet au *MetaPlayer* de communiquer avec l'*Application*.
 */
function getApplication(iframe: HTMLIFrameElement): Application {
    if (iframe[applicationSymbol] != null) return iframe[applicationSymbol];
    const rpc = getRpc(iframe);
    iframe[applicationSymbol] = {
        ping: () => rpc.call('ping', []),
        loadContent: (mode, content) => rpc.call('loadContent', [mode, content]),
        getContent: () => rpc.call('getContent', []),
        contentSaved: () => rpc.call('contentSaved', []),
    };
    return iframe[applicationSymbol];
}

/**
 * Permet au *MetaPlayer* d'exposer sa propre implémentaion à l'*Application*.
 * Ne devrait être appelée qu'une seule fois.
 * 
 * @param iframe L'iframe de l'*Application*.
 * @param provider L'implémentation de l'interface `MetaPlayer` fournie par le *MetaPlayer*.
 */
export function plug(iframe: HTMLIFrameElement, provider: MetaPlayer): void {
    if (iframe[pluggedSymbol]) throw new Error('MetaPlayer already plugged');
    const rpc = getRpc(iframe);
    rpc.expose('ping', () => provider.ping());
    rpc.expose<Parameters<MetaPlayer['appReady']>>('appReady', ([manifest]) => provider.appReady(manifest));
    rpc.expose('contentChanged', () => provider.contentChanged());
    iframe[pluggedSymbol] = true;
}

/**
 * @param iframe L'iframe de l'*Application*.
 * @returns le socket du *MetaPlayer*.
 */
function getSocket(iframe: HTMLIFrameElement): MetaPlayerSocket<Contract> {
    return {
        plug(provider: Provider<Contract['metaplayer']>): void { plug(iframe, provider); },
        get application() { return getApplication(iframe); },
    };
}

export default getSocket;
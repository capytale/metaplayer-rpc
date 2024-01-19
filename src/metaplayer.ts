/**
 * Une proposition d'implémentaion du côté *MetaPlayer* de la communication basée sur @mixer/postmessage-rpc
 * 
 * - fournit une instance de `ApplicationConnection` au '*MetaPlayer* pour communiquer avec l'*Application*
 * - permet au *MetaPlayer* d'exposer sa propre implémentaion à l'*Application*
 */

import { RPC } from '@mixer/postmessage-rpc';

import type { MetaPlayerConnection, ApplicationConnection, ActivityMode, MetaPlayerManifest, ApplicationManifest } from './remoteInterfaces';

const rpcSymbol = Symbol('rpc');
const applicationSymbol = Symbol('application');

function getRpc(iframe: HTMLIFrameElement): RPC | null {
    if (iframe[rpcSymbol] != null) return iframe[rpcSymbol];
    if (iframe.contentWindow == null) return null;
    iframe[rpcSymbol] = new RPC({
        target: iframe.contentWindow,
        serviceId: 'capytale-player',
    });
    return iframe[rpcSymbol];
}

/**
 * @param iframe L'iframe de l'*Application*.
 * @returns Une instance de `ApplicationConnection` qui permet au *MetaPlayer* de communiquer avec l'*Application*.
 */
export function getApplicationConnection(iframe: HTMLIFrameElement): ApplicationConnection | null {
    if (iframe[applicationSymbol] != null) return iframe[applicationSymbol];
    const rpc = getRpc(iframe);
    if (rpc == null) return null;
    iframe[applicationSymbol] = {
        ping: () => rpc.call('ping', {}),
        loadContent: (mode, content) => rpc.call('loadContent', { mode, content }),
        getContent: () => rpc.call('getContent', {}),
        contentSaved: () => rpc.call('contentSaved', {}),
    };
    return iframe[applicationSymbol];
}

/**
 * Décrit l'implémentation que le *MetaPlayer* doit fournir.
 * 
 * Cette interface reprend les méthodes de @see`MetaPlayerConnection` mais avec des valeurs de retour
 * qui ne sont pas nécessairement des promesses.
 */
export interface MetaPlayer {
    ping(): 'pong' | Promise<'pong'>;
    appReady(manifest: ApplicationManifest): void | MetaPlayerManifest | Promise<void | MetaPlayerManifest>;
    contentChanged(): void | Promise<void>;
}

/**
 * Permet au *MetaPlayer* d'exposer sa propre implémentaion à l'*Application*.
 * Ne devrait être appelée qu'une seule fois.
 * 
 * @param iframe L'iframe de l'*Application*.
 * @param impl L'implémentation de l'interface `MetaPlayer` fournie par le *MetaPlayer*.
 */
export function setMetaPlayerImpl(iframe: HTMLIFrameElement,impl: MetaPlayer): void {
    const rpc = getRpc(iframe);
    if (rpc == null) return;
    rpc.expose('ping', () => impl.ping());
    rpc.expose<{ manifest: ApplicationManifest }>('appReady', ({ manifest }) => impl.appReady(manifest));
    rpc.expose('contentChanged', () => impl.contentChanged());
}

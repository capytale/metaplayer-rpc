/**
 * Une proposition d'implémentaion du côté *Application* de la communication basée sur @mixer/postmessage-rpc
 * 
 * - fournit une instance de `MetaPlayerConnection` à l'*Application* pour communiquer avec le *MetaPlayer*
 * - permet à l'*Application* d'exposer sa propre implémentaion au *MetaPlayer*
 */

import { RPC } from '@mixer/postmessage-rpc';

import type { MetaPlayerConnection, ApplicationConnection, ActivityMode } from './remoteInterfaces';

let metaPlayer: MetaPlayerConnection | null = null;
let rpc: RPC | null = null;

function getRpc(): RPC | null {
    if (rpc != null) return rpc;
    // Sommes-nous dans un iframe ?
    if (window.parent == window) return null;
    rpc = new RPC({
        target: window.parent,
        serviceId: 'MetaPlayerConnection',
    });
    return rpc;
}

/**
 * @returns Une instance de `MetaPlayerConnection` qui permet à l'*Application* de communiquer avec le *MetaPlayer*.
 *          Retourne `null` si l'*Application* n'est pas dans un iframe.
 */
export function getMetaPlayerConnection(): MetaPlayerConnection | null {
    if (metaPlayer != null) return metaPlayer;
    const rpc = getRpc();
    if (rpc == null) return null;
    metaPlayer = {
        ping: () => rpc.call('ping', {}),
        appReady: (manifest) => rpc.call('appReady', { manifest }),
        contentChanged: () => rpc.call('contentChanged', {}),
    };
    return metaPlayer;
}

/**
 * Décrit l'implémentation que l'*Application* doit fournir.
 * 
 * Cette interface reprend les méthodes de @see`ApplicationConnection` mais avec des valeurs de retour
 * qui ne sont pas nécessairement des promesses.
 */
export interface Application {
    ping(): 'pong' | Promise<'pong'>;
    loadContent(mode: ActivityMode, content: string | null): void | Promise<void>;
    getContent(): string | null | Promise<string | null>;
    contentSaved(): void | Promise<void>;
}

/**
 * Permet à l'*Application* d'exposer sa propre implémentaion au *MetaPlayer*.
 * Ne devrait être appelée qu'une seule fois.
 * 
 * @param impl L'implémentation de l'interface `Application` fournie par l'*Application*.
 */
export function setApplicationImpl(impl: Application): void {
    const rpc = getRpc();
    if (rpc == null) return;
    rpc.expose('ping', () => impl.ping());
    rpc.expose<{ mode: ActivityMode, content: string }>('loadContent', ({ mode, content }) => impl.loadContent(mode, content));
    rpc.expose('getContent', () => impl.getContent());
}

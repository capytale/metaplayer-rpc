/**
 * Une proposition d'implémentaion du côté *Application* de la communication basée sur @mixer/postmessage-rpc
 * 
 * - fournit une instance de `MetaPlayerConnection` à l'*Application* pour communiquer avec le *MetaPlayer*
 * - permet à l'*Application* d'exposer sa propre implémentaion au *MetaPlayer*
 */

import { RPC } from '@mixer/postmessage-rpc';

import type { Contract } from '../../contract/basic';
import type { ApplicationSocket, Provider } from '..';

type MetaPlayer = ApplicationSocket<Contract>['metaplayer'];
type Application = Provider<Contract['application']>;

let metaPlayer: MetaPlayer | null = null;
let rpc: RPC | null = null;

function getRpc(): RPC | null {
    if (rpc != null) return rpc;
    // Sommes-nous dans un iframe ?
    if (window.parent === window) return null;
    rpc = new RPC({
        target: window.parent,
        serviceId: 'capytale-player',
    });
    return rpc;
}

/**
 * @returns Une connexion vers le `MetaPlayerContract` qui permet à l'*Application* de communiquer avec le *MetaPlayer*.
 *          Retourne `null` si l'*Application* n'est pas dans un iframe.
 */
function getMetaPlayer(): MetaPlayer {
    if (metaPlayer != null) return metaPlayer;
    const rpc = getRpc();
    if (rpc == null) throw new Error('Application is not in an iframe');
    metaPlayer = {
        ping: () => rpc.call('ping', []),
        appReady: (manifest) => rpc.call('appReady', [manifest]),
        contentChanged: () => rpc.call('contentChanged', []),
    };
    return metaPlayer;
}

let plugged = false;
/**
 * Permet à l'*Application* d'exposer sa propre implémentaion au *MetaPlayer*.
 * Ne devrait être appelée qu'une seule fois.
 * 
 * @param provider L'implémentation du contrat `ApplicationContract` fournie par l'*Application*.
 */
function plug(provider: Application): void {
    if (plugged) throw new Error('Application already plugged');
    const rpc = getRpc();
    if (rpc == null) throw new Error('Application is not in an iframe');
    rpc.expose('ping', () => provider.ping());
    rpc.expose<Parameters<Application['loadContent']>>('loadContent', ([mode, content]) => provider.loadContent(mode, content));
    rpc.expose('getContent', () => provider.getContent());
    plugged = true;
}

/**
 * Socket de l'*Application*.
 */
const socket: ApplicationSocket<Contract> = {
    plug,
    get metaplayer() { return getMetaPlayer(); },
};

export default socket;

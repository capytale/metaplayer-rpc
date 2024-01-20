/**
 * Une proposition d'implémentaion du côté *Application* de la communication basée sur @mixer/postmessage-rpc
 * 
 * - fournit une instance de `MetaPlayerConnection` à l'*Application* pour communiquer avec le *MetaPlayer*
 * - permet à l'*Application* d'exposer sa propre implémentaion au *MetaPlayer*
 */

import { windowEndpoint, expose, wrap } from 'comlink';
import type { Endpoint } from 'comlink';

import type { Contract } from '../../contract';
import type { ApplicationSocket, Provider } from '..';

type MetaPlayer<C extends Contract> = ApplicationSocket<C>['metaplayer'];
type Application<C extends Contract> = Provider<C['application']>;

let metaPlayer: MetaPlayer<Contract> | null = null;
let endpoint: Endpoint | null = null;

function getEndpoint(): Endpoint | null {
    if (endpoint != null) return endpoint;
    // Sommes-nous dans un iframe ?
    if (window.parent === window) return null;
    endpoint = windowEndpoint(window.parent)
    return endpoint;
}

/**
 * @returns Une instance de `MetaPlayerConnection` qui permet à l'*Application* de communiquer avec le *MetaPlayer*.
 *          Retourne `null` si l'*Application* n'est pas dans un iframe.
 */
function getMetaPlayer<C extends Contract>(): MetaPlayer<C> {
    if (metaPlayer != null) return metaPlayer;
    const endpoint = getEndpoint();
    if (endpoint == null) throw new Error('Application is not in an iframe');
    metaPlayer = wrap(endpoint);
    return metaPlayer;
}

let plugged = false;
/**
 * Permet à l'*Application* d'exposer sa propre implémentaion au *MetaPlayer*.
 * Ne devrait être appelée qu'une seule fois.
 * 
 * @param provider L'implémentation de l'interface `Application` fournie par l'*Application*.
 */
function plug<C extends Contract>(provider: Application<C>): void {
    if (plugged) throw new Error('Application already plugged');
    const endpoint = getEndpoint();
    if (endpoint == null) throw new Error('Application is not in an iframe');
    expose(provider, endpoint);
    plugged = true;
}

/**
 * Socket de l'*Application*.
 */
function getSocket<C extends Contract>(): ApplicationSocket<C> {
    getEndpoint();
    return {
        plug,
        get metaplayer() { return getMetaPlayer(); },
    }
};

export default getSocket;


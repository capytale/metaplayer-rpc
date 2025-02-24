import type { Link } from '@capytale/contract-socket';

import { windowEndpoint, expose, wrap, proxy } from 'comlink';

export function createApplicationLink(mpOrigin?: string): Link {
    let _notifiedReady = false;
    let _onDeclare: undefined | Link['onDeclare'];
    let _onDone: undefined | Link['onDone'];
    let _onProvide: undefined | Link['onProvide'];

    let remote: {
        ready(): Promise<void>;
        declare(ids: any[]): Promise<void>;
        done(): Promise<void>;
        provide(name: any, version: any, i: any): Promise<void>;
    } | undefined;
    let connected = false;
    if (window.parent === window) {
        console.warn('Contract link is not supported in standalone mode');
        // Dummy implementation
        remote = {
            ready() {
                return Promise.resolve();
            },
            declare() {
                return Promise.resolve();
            },
            done() {
                return Promise.resolve();
            },
            provide(name: string, version: number, i: any) {
                return Promise.resolve();
            }
        }
    } else {
        const endpoint = windowEndpoint(window.parent, undefined, mpOrigin);
        expose({
            declare(ids: { name: string, version?: number }[]) {
                if (_onDeclare == null) throw new Error('No handler for declare');
                _onDeclare(ids);
            },
            done() {
                if (_onDone == null) throw new Error('No handler for done');
                _onDone();
            },
            provide(name: string, version: number, i: any) {
                if (_onProvide == null) throw new Error('No handler for provide');
                _onProvide(name, version, i);
            }
        }, endpoint);
        remote = wrap<{
            ready(): void;
            declare(ids: any[]): void;
            done(): void;
            provide(name: any, version: any, i: any): void;
        }>(endpoint);
        connected = true;
    }

    const _signalReady = () => {
        if (!_notifiedReady) {
            if (_onDeclare == null || _onDone == null || _onProvide == null) return;
            _notifiedReady = true;
            remote.ready();
        }
    };

    return {
        declare: (ids) => {
            return remote.declare(ids);
        },
        done: () => {
            return remote.done();
        },
        provide: (name, version, i) => {
            return remote.provide(name, version, proxy(i));
        },
        get isReady() {
            return connected;
        },
        set onDeclare(value: (ids: { name: string, version?: number }[]) => void) {
            _onDeclare = value;
            _signalReady();
        },
        set onDone(value: () => void) {
            _onDone = value;
            _signalReady();
        },
        set onProvide(value: (name: string, version: number, i: any) => void) {
            _onProvide = value;
            _signalReady();
        }
    };
}

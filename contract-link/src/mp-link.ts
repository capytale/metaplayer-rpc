import type { Link } from '@capytale/contract-socket';

import { windowEndpoint, expose, wrap, proxy, type Remote } from 'comlink';

export function createMetaplayerLink(appIframe: HTMLIFrameElement, appOrigin?: string): Link {
    let _Ready = false;
    let _onDeclare: undefined | Link['onDeclare'];
    let _onDone: undefined | Link['onDone'];
    let _onProvide: undefined | Link['onProvide'];
    let remote: undefined | Remote<{
        declare(ids: any[]): void;
        done(): void;
        provide(name: any, version: any, i: any): void;
    }>;
    function connect(w: Window): void {
        const endpoint = windowEndpoint(w, undefined, appOrigin);
        expose({
            ready() {
                _Ready = true;
            },
            declare(ids: { name: string, version: number }[]) {
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
            declare(ids: any[]): void;
            done(): void;
            provide(name: any, version: any, i: any): void;
        }>(endpoint);
    }
    if (appIframe.contentWindow == null) {
        appIframe.onload = () => {
            connect(appIframe.contentWindow!);
        };
    } else {
        connect(appIframe.contentWindow);
    }

    return {
        declare: (ids) => {
            if (remote == null) throw new Error('No connection to remote');
            return remote.declare(ids);
        },
        done: () => {
            if (remote == null) throw new Error('No connection to remote');
            return remote.done();
        },
        provide: (name, version, i) => {
            if (remote == null) throw new Error('No connection to remote');
            return remote.provide(name, version, proxy(i));
        },
        get isReady() {
            return _Ready;
        },
        set onDeclare(value: (ids: { name: string, version: number }[]) => void) {
            _onDeclare = value;
        },
        set onDone(value: () => void) {
            _onDone = value;
        },
        set onProvide(value: (name: string, version: number, i: any) => void) {
            _onProvide = value;
        }
    };
}

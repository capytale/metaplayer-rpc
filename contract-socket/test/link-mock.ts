import { type Link } from '../src';

export function createProxy(i: any): any {
    if (i == null) return null;
    return new Proxy(i, {
        get: (target, prop) => {
            const original = Reflect.get(target, prop);
            if (typeof original !== "function") {
                return original;
            }
            return (...args: any) => {
                return new Promise((resolve, reject) => {
                    setTimeout(async () => {
                        try {
                            const res = await original(...args);
                            resolve(res);
                        } catch (e) {
                            reject(e);
                        }
                    });
                });
            };
        }
    });
}

const debug = false;
function log(...args: any[]) {
    if (!debug) return;
    console.log(...args);
}

export function createLinks(): [Link, Link] {


    let mpReady = false,
        mpOnDeclare: undefined | Link['onDeclare'],
        appOnDeclare: undefined | Link['onDeclare'],
        mpOnDone: undefined | Link['onDone'],
        appOnDone: undefined | Link['onDone'],
        mpOnProvide: undefined | Link['onProvide'],
        appOnProvide: undefined | Link['onProvide'];


    const mpLink: Link = {
        declare: (ids) => {
            const _appOnDeclare = appOnDeclare;
            if (_appOnDeclare == null) throw new Error('No handler for declare');
            return new Promise((resolve) => {
                setTimeout(() => {
                    try {
                        log('app.onDeclare', ids);
                        _appOnDeclare(ids);
                    }
                    finally {
                        resolve();
                    }
                });
            });
        },
        done: () => {
            const _appOnDone = appOnDone;
            if (_appOnDone == null) throw new Error('No handler for done');
            return new Promise((resolve) => {
                setTimeout(() => {
                    try {
                        log('app.onDone');
                        _appOnDone();
                    }
                    finally {
                        resolve();
                    }
                });
            });
        },
        provide: (name, version, i) => {
            const _appOnProvide = appOnProvide;
            if (_appOnProvide == null) return Promise.reject(new Error('No handler for provide'));
            return new Promise((resolve) => {
                setTimeout(() => {
                    try {
                        log('app.onProvide', name, version);
                        _appOnProvide(name, version, createProxy(i));
                    }
                    finally {
                        resolve();
                    }
                });
            });
        },
        get name() {
            return 'mp';
        },
        get isReady() {
            return mpReady;
        },
        set onDeclare(value: Link['onDeclare']) {
            mpOnDeclare = (ids) => {
                mpReady = true;
                value!(ids);
            };
        },
        set onDone(value: Link['onDone']) {
            mpOnDone = () => {
                mpReady = true;
                value!();
            }
        },
        set onProvide(value: Link['onProvide']) {
            mpOnProvide = (name, version, i) => {
                mpReady = true;
                value!(name, version, i);
            }
        }
    };

    const appLink: Link = {
        declare: (ids) => {
            const _mpOnDeclare = mpOnDeclare;
            if (_mpOnDeclare == null) throw new Error('No handler for declare');
            return new Promise((resolve) => {
                setTimeout(() => {
                    try {
                        log('mp.onDeclare', ids);
                        _mpOnDeclare(ids);
                    }
                    finally {
                        resolve();
                    }
                });
            });
        },
        done: () => {
            const _mpOnDone = mpOnDone;
            if (_mpOnDone == null) throw new Error('No handler for done');
            return new Promise((resolve) => {
                setTimeout(() => {
                    try {
                        log('mp.onDone');
                        _mpOnDone();
                    }
                    finally {
                        resolve();
                    }
                });
            });
        },
        provide: (name, version, i) => {
            const _mpOnProvide = mpOnProvide;
            if (_mpOnProvide == null) return Promise.reject(new Error('No handler for provide'));
            return new Promise((resolve) => {
                setTimeout(() => {
                    try {
                        log('mp.onProvide', name, version);
                        _mpOnProvide(name, version, createProxy(i));
                    }
                    finally {
                        resolve();
                    }
                });
            });
        },
        get name() {
            return 'app';
        },
        get isReady() {
            return true;
        },
        set onDeclare(value: Link['onDeclare']) {
            appOnDeclare = value;
        },
        set onDone(value: Link['onDone']) {
            appOnDone = value;
        },
        set onProvide(value: Link['onProvide']) {
            appOnProvide = value;
        }
    };
    return [mpLink, appLink];
}

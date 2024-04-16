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
            setTimeout(() => {
                _appOnDeclare(ids);
            });
        },
        done: () => {
            const _appOnDone = appOnDone;
            if (_appOnDone == null) throw new Error('No handler for done');
            setTimeout(() => {
                _appOnDone();
            });
        },
        provide: (name, version, i) => {
            const _appOnProvide = appOnProvide;
            if (_appOnProvide == null) return Promise.reject(new Error('No handler for provide'));
            return new Promise((resolve) => {
                setTimeout(() => {
                    try {
                        _appOnProvide(name, version, createProxy(i));
                    }
                    finally {
                        resolve();
                    }
                });
            });
        },
        get isReady() {
            return mpReady;
        },
        set onDeclare(value) {
            mpOnDeclare = (ids) => {
                mpReady = true;
                value!(ids);
            };
        },
        set onDone(value) {
            mpOnDone = () => {
                mpReady = false;
                value!();
            }
        },
        set onProvide(value) {
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
            setTimeout(() => {
                _mpOnDeclare(ids);
            });
        },
        done: () => {
            const _mpOnDone = mpOnDone;
            if (_mpOnDone == null) throw new Error('No handler for done');
            setTimeout(() => {
                _mpOnDone();
            });
        },
        provide: (name, version, i) => {
            const _mpOnProvide = mpOnProvide;
            if (_mpOnProvide == null) return Promise.reject(new Error('No handler for provide'));
            return new Promise((resolve) => {
                setTimeout(() => {
                    try {
                        _mpOnProvide(name, version, createProxy(i));
                    }
                    finally {
                        resolve();
                    }
                });
            });
        },
        get isReady() {
            return true;
        },
        set onDeclare(value) {
            appOnDeclare = value;
        },
        set onDone(value) {
            appOnDone = value;
        },
        set onProvide(value) {
            appOnProvide = value;
        }
    };
    return [mpLink, appLink];
}

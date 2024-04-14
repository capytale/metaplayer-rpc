import { type Link, type Socket, createSocket } from '../src';
import type { CollectionEx } from '@capytale/contract-type/test/example';

let mpReady = false,
    mpOnDeclare: undefined | Link['onDeclare'],
    appOnDeclare: undefined | Link['onDeclare'],
    mpOnDone: undefined | Link['onDone'],
    appOnDone: undefined | Link['onDone'],
    mpOnProvide: undefined | Link['onProvide'],
    appOnProvide: undefined | Link['onProvide'];

const metaplayerLink: Link = {
    declare: (ids) => {
        mpOnDeclare && mpOnDeclare(ids);
    },
    done: () => {
        mpOnDone && mpOnDone();
    },
    provide: (name, version, i) => {
        if (mpOnProvide == null) return Promise.reject(new Error('No handler for provide'));
        mpOnProvide(name, version, i);
        return Promise.resolve();
    },
    get isReady() {
        return mpReady;
    },
    get onDeclare() {
        return mpOnDeclare;
    },
    set onDeclare(value) {
        mpOnDeclare = value;
    },
    get onDone() {
        return mpOnDone;
    },
    set onDone(value) {
        mpOnDone = value;
    },
    get onProvide() {
        return mpOnProvide;
    },
    set onProvide(value) {
        mpOnProvide = value;
    }
};

export const metaplayerSocket = createSocket(metaplayerLink) as Socket<CollectionEx, 'metaplayer'>;

const applicationLink: Link = {
    declare: (ids) => {
        appOnDeclare && appOnDeclare(ids);
    },
    done: () => {
        appOnDone && appOnDone();
    },
    provide: (name, version, i) => {
        if (appOnProvide == null) return Promise.reject(new Error('No handler for provide'));
        appOnProvide(name, version, i);
        return Promise.resolve();
    },
    get isReady() {
        return true;
    },
    get onDeclare() {
        return appOnDeclare;
    },
    set onDeclare(value) {
        appOnDeclare = value;
    },
    get onDone() {
        return appOnDone;
    },
    set onDone(value) {
        appOnDone = value;
    },
    get onProvide() {
        return appOnProvide;
    },
    set onProvide(value) {
        appOnProvide = value;
    }
};

export const applicationSocket = createSocket(applicationLink) as Socket<CollectionEx, 'application'>;

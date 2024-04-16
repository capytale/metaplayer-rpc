export type BarV1<T> = {
    version: 1;
    metaplayer: {
        get(): T;
    };
    application: {
        put(v: T): void;
    };
}

export type BarV2<T> = {
    version: 2;
    metaplayer: {
        get(): T;
    };
    application: {
        put(v: T): void;
        del(): void;
    };
}

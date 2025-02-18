export function createPromiseCompletionSource():
    [Promise<unknown>, (v: unknown) => void] {
    let resolve: (v: unknown) => void;
    const promise = new Promise((res, rej) => {
        resolve = res;
    });
    return [promise, resolve!];
}

export function waitPromise(duration: number) {
    return new Promise<void>(res => {
        setTimeout(res, duration);
    });
}
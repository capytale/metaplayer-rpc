import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, type UserConfig } from 'vite';

// déclare le typage de l'environnement nodejs (plus léger que @types/node)
declare const process: {
    cwd: () => string;
    env: {
        [key: string]: string | undefined;
    };
};
declare const console: {
    log: (...args: any[]) => void;
    warn: (...args: any[]) => void;
    error: (...args: any[]) => void;
};

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ }) => {
    return {
        build: {
            rollupOptions: {
                input: {
                    main: resolve(__dirname, 'index.html'),
                    iframe: resolve(__dirname, 'iframe.html'),
                }
            }
        }
    } satisfies UserConfig;
});
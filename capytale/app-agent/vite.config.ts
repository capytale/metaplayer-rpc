import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

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

export default defineConfig(({ }) => {
    return {
        define: {
            __LIB_VERSION__: JSON.stringify(process.env.npm_package_version),
        },
        build: {
            lib: {
                entry: 'src/index.ts',
                formats: ['es', 'umd'],
                fileName: 'index',
                name: 'AppAgent',
            },
            outDir: 'lib',
            rollupOptions: {
                external: ['comlink'],
                output: {
                    globals: {
                        comlink: 'Comlink',
                    },
                }
            },
        },
        plugins: [
            dts({
                rollupTypes: true,
                bundledPackages: [
                    '@capytale/contract-link',
                    '@capytale/contract-socket',
                    '@capytale/contract-type',
                ]
            }),
        ],
    }
});

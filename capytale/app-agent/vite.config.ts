import { defineConfig, loadEnv } from 'vite';
import dts from 'vite-plugin-dts';
// @ts-ignore
import path from 'path';

// déclare le typage de l'environnement nodejs (plus léger que @types/node)
declare namespace path {
    function join(...paths: string[]): string;
}
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
    const envVars = loadEnv('', path.join(process.cwd(), '..'), '');
    const cdnBase = envVars.CDN_URL;
    const appAgentVersion: string = process.env.npm_package_version!;
    const appAgentShortVersion = appAgentVersion.split('.').slice(0, 2).join('.');

    return {
        define: {
            __APP_AGENT_VERSION__: JSON.stringify(appAgentVersion),
            __APP_AGENT_SHORT_VERSION__: JSON.stringify(appAgentShortVersion),
            __APP_AGENT_NAME__: JSON.stringify('app-agent'),
            __CDN_BASE_URL__: JSON.stringify(cdnBase),
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

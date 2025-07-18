import { defineConfig, loadEnv, type UserConfig } from 'vite';

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

import comlinkInfo from 'comlink/package.json' with { type: 'json' };

export default defineConfig(({ }) => {
    const comlinkVersion = comlinkInfo.version;
    const envVars = loadEnv('', process.cwd(), '');
    const cdnBase = envVars.CDN_URL;
    let alias: Record<string, string> = {};
    if (cdnBase != null) {
        alias['comlink'] = `${cdnBase}/comlink/${comlinkVersion}/comlink.min.js`;
    }

    const config: UserConfig = {
        build: {
            lib: {
                entry: [
                    'src/mp-agent.ts',
                    'src/app-agent.ts',
                ],
                formats: ['es'],
            },
            outDir: 'lib',
        },
        plugins: [
        ],
        resolve: { alias },
    };
    return config;
});

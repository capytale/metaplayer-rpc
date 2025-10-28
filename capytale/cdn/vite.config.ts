import { defineConfig, loadEnv, type UserConfig } from 'vite';
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

import comlinkInfo from 'comlink/package.json' with { type: 'json' };
import appAgentInfo from '@capytale/app-agent/package.json' with { type: 'json' };
import mpAgentInfo from '@capytale/mp-agent/package.json' with { type: 'json' };

export default defineConfig(({ }) => {
    const comlinkVersion = comlinkInfo.version;
    const appAgentVersion = appAgentInfo.version;
    const mpAgentVersion = mpAgentInfo.version;
    const envVars = loadEnv('', path.join(process.cwd(), '..'), '');
    const cdnBase = envVars.CDN_URL;
    let alias: Record<string, string> = {};
    if (cdnBase != null) {
        alias['comlink'] = `${cdnBase}/comlink/${comlinkVersion}/comlink.min.js`;
    }

    const config: UserConfig = {
        define: {
            __APP_AGENT_VERSION__: JSON.stringify(appAgentVersion),
            __APP_AGENT_NAME__: JSON.stringify('app-agent'),
            __MP_AGENT_VERSION__: JSON.stringify(mpAgentVersion),
            __MP_AGENT_NAME__: JSON.stringify('mp-agent'),
        },
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

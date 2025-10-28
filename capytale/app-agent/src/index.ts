declare const __APP_AGENT_VERSION__: string;
declare const __APP_AGENT_SHORT_VERSION__: string;
declare const __APP_AGENT_NAME__: string;
declare const __CDN_BASE_URL__: string;
console.log(`[${__APP_AGENT_NAME__}@${__APP_AGENT_VERSION__}] loaded`);
console.warn(
    `You are running a bundled version of ${__APP_AGENT_NAME__}.`,
    'For production, you should instead import it as an external dependency from ' +
    (__CDN_BASE_URL__ ?
        `our CDN at ${__CDN_BASE_URL__}/capytale/contracts/${__APP_AGENT_SHORT_VERSION__}/${__APP_AGENT_NAME__}.min.js` :
        'a CDN')
);
export * from './socket';

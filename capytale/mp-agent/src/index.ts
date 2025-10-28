declare const __MP_AGENT_VERSION__: string;
declare const __MP_AGENT_SHORT_VERSION__: string;
declare const __MP_AGENT_NAME__: string;
declare const __CDN_BASE_URL__: string;
console.log(`[${__MP_AGENT_NAME__}@${__MP_AGENT_VERSION__}] loaded`);
console.warn(
    `You are running a bundled version of ${__MP_AGENT_NAME__}.`,
    'For production, you should instead import it as an external dependency from ' +
    (__CDN_BASE_URL__ ?
        `our CDN at ${__CDN_BASE_URL__}/capytale/contracts/${__MP_AGENT_SHORT_VERSION__}/${__MP_AGENT_NAME__}.min.js` :
        'a CDN')
);
export * from './socket';

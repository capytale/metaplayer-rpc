import * as path from 'path';

const projectRootDir = path.resolve(__dirname);

export default {
    // config options
    resolve: {
        alias: [
            { find: '@capytale/metaplayer-rpc/connection', replacement: path.resolve(projectRootDir, '../../connection') },
            { find: '@capytale/metaplayer-rpc/contract', replacement: path.resolve(projectRootDir, '../../contract') },
        ],
    },
    server: {
        port: 3001,
        strictPort: true,
    },
}
import * as path from 'path';
import dts from 'vite-plugin-dts';

const projectRootDir = path.resolve(__dirname);

export default {
    // config options
    build: {
        lib: {
            entry: path.resolve(projectRootDir, 'src/index.ts'),
            formats: ['es'],
            name: 'metaplayer-rpc',
            fileName: 'index',
        },
        rollupOptions: {
            // make sure to externalize deps that shouldn't be bundled
            // into your library
            external: ['comlink'],
            output: {
                // Provide global variables to use in the UMD build
                // for externalized deps
                globals: {
                    comlink: 'Comlink',
                },
            },
        },
    },
    plugins: [
        dts(),
    ]
}
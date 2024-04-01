import * as path from 'path';
import dts from 'vite-plugin-dts';

const projectRootDir = path.resolve(__dirname);

/** @type {import('vite').UserConfig} */
export default {
    // config options
    build: {
        lib: {
            entry: path.resolve(projectRootDir, 'src/index.ts'),
            formats: ['es'],
            fileName: 'index',
        },
        outDir: path.resolve(projectRootDir, 'lib'),
        rollupOptions: {
        },
    },
    plugins: [
        dts({ rollupTypes: true }),
    ]
}
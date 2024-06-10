import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';


export default defineConfig(  {
    build: {
        lib: {
            entry: 'src/index.ts',
            formats: ['es', 'umd'],
            fileName: 'index',
            name: 'MpAgent',
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
    ]
});

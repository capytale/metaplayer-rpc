import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';


export default defineConfig({
    build: {
        lib: {
            entry: 'src/index.ts',
            formats: ['es'],
            fileName: 'index',
        },
        outDir: 'lib',
        rollupOptions: {
            external: ['comlink'],
        },
    },
    plugins: [
        dts({
            rollupTypes: true,
            bundledPackages: [
                '@capytale/contract-link',
                '@capytale/contract-socket',
                '@capytale/contract-type',
                '@capytale/contracts'
            ]
        }),
    ],
});

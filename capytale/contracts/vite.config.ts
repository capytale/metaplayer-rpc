import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
    // config options
    build: {
        lib: {
            entry: 'src/index.ts',
            formats: ['es'],
            fileName: 'index',
        },
        outDir: 'lib',
        rollupOptions: {
        },
    },
    plugins: [
        dts({
            rollupTypes: true,
            bundledPackages: [
                '@capytale/contract-builder',
            ]
        }),
    ],
});
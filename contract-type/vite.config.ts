import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';


export default defineConfig(  {
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
        dts({ rollupTypes: true }),
    ]
});

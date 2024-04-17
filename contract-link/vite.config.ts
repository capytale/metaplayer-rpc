import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';


export default defineConfig({
    build: {
        lib: {
            entry: ['src/app-link.ts', 'src/mp-link.ts'],
            formats: ['es'],
        },
        outDir: 'lib',
        rollupOptions: {
            external: ['comlink'],
        },
    },
    plugins: [
        dts({ rollupTypes: true,  }),
    ]
});

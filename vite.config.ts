import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                content: resolve(__dirname, 'src/content.ts'),
                storm: resolve(__dirname, 'src/storm.ts'),
            },
            output: {
                entryFileNames: '[name].js',
                dir: 'dist',
                format: 'es'
            }
        },
        outDir: 'dist',
        emptyOutDir: true
    }
});

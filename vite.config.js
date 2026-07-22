import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
    root: resolve(__dirname, 'public'),
    base: '/',

    build: {
        outDir: resolve(__dirname, 'public/build'),
        emptyOutDir: true,
        sourcemap: false,

        rollupOptions: {
            input: resolve(__dirname, 'public/src/main.js'),

            output: {
                entryFileNames: 'app.js',
                chunkFileNames: 'chunks/[name]-[hash].js',
                assetFileNames: 'assets/[name]-[hash][extname]',
            },
        },
    },
});
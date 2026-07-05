/**
 * Single-file preview build: inlines the dictionary chunks so the whole app
 * is one JS asset (used to package self-contained snapshots of the app,
 * e.g. for sharing a build as a single HTML file). Not the deployed build.
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: 'dist-preview',
    emptyOutDir: true,
    modulePreload: { polyfill: false },
    chunkSizeWarningLimit: 1500,
    rollupOptions: { output: { inlineDynamicImports: true } },
  },
});

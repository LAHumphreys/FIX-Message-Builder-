/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// BASE_PATH is set by the Pages deploy workflow (e.g. "/FIX-Message-Builder-/");
// local dev and CI builds serve from the root.
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
  build: {
    // The modulepreload polyfill calls fetch(); disabling it keeps the
    // zero-tolerance bundle privacy check (scripts/check-privacy.mjs) clean.
    modulePreload: { polyfill: false },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    coverage: {
      provider: 'v8',
      include: ['src/engine/**'],
      reporter: ['text', 'html'],
    },
  },
});

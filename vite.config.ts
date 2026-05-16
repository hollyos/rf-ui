import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// Vite configuration.
// - React plugin for JSX + Fast Refresh.
// - Relative `base` so the built site can be opened from disk or any sub-path.
// - SCSS configured (Vite supports `.scss` out of the box once `sass` is installed).
// - Vitest config lives in this file too (jsdom env + globals).
export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), 'src'),
    },
  },
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        silenceDeprecations: ['legacy-js-api', 'import'],
      },
    },
  },
  build: {
    cssCodeSplit: true,
    assetsInlineLimit: 0,
  },
  server: {
    port: 5173,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    include: ['src/**/*.test.{ts,tsx}'],
  },
});

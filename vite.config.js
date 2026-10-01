import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'node:fs';

export default defineConfig({
  base: './',
  plugins: [{ name: 'source-entry', transformIndexHtml: { order: 'pre', handler: () => readFileSync(new URL('./src/shell.html', import.meta.url), 'utf8') } }, react()],
  build: { outDir: 'dist', emptyOutDir: true }
});

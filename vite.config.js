import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'node:fs';

export default defineConfig({
  base: './',
  plugins: [
    {
      name: 'source-entry',
      transformIndexHtml: {
        order: 'pre',
        handler: () => readFileSync(new URL('./src/shell.html', import.meta.url), 'utf8')
      }
    },
    react()
  ],
  server: {
    port: 5173,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      },
      '/uploads': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});

import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  root: resolve(__dirname),
  publicDir: resolve(__dirname, 'public'),
  build: {
    outDir: resolve(__dirname, '../../dist/apps/gallery-web'),
    emptyOutDir: true
  },
  resolve: {
    alias: {
      '@gallery/engine': resolve(__dirname, '../../packages/engine/src')
    }
  },
  server: {
    host: process.env.VITE_HOST || '127.0.0.1',
    port: Number(process.env.VITE_PORT || 4200)
  }
});

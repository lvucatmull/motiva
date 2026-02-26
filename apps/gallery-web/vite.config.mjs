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
    host: '0.0.0.0',
    port: 4200
  }
});

import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { fileURLToPath, URL } from 'url';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  root: resolve(__dirname),
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('.', import.meta.url)),
    },
  },
  build: {
    outDir: './dist',
    minify: false,
  },
  server: {
    hmr: true,
    watch: { cwd: '.' },
  },
});

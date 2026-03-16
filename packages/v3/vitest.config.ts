import { fileURLToPath, URL } from 'node:url';
import { configDefaults, defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      server: {
        deps: {
          external: ['@googlemaps/markerclusterer', 'google.maps'],
        },
      },
      environment: 'jsdom', // or 'happy-dom', 'jsdom', 'node'
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      coverage: {
        provider: 'v8', // 'istanbul' or 'c8'
        reporter: ['text', 'json', 'html'],
      },
    },
  }),
);

import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
    baseUrl: 'http://localhost:4173',
    // Increased from the default 4000ms to give slow CI runners (Windows,
    // macOS) enough time for the Google Maps API to initialise and for
    // window.__mapMarkers__ to be populated before assertions retry out.
    defaultCommandTimeout: 8000,
  },
});

import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'tests/e2e/**/*.spec.{js,jsx,ts,tsx}',
    supportFile: 'tests/e2e/support/e2e.ts',
    videosFolder: 'tests/e2e/videos',
    screenshotsFolder: 'tests/e2e/screenshots',
    downloadsFolder: 'tests/e2e/downloads',
    fixturesFolder: 'tests/e2e/fixtures',

    setupNodeEvents(on, config) {
      // implement node event listeners here
    },

    viewportWidth: 1280,
    viewportHeight: 720,

    // Retry failed tests
    retries: {
      runMode: 2,
      openMode: 0,
    },

    // Video settings
    video: true,
    videoCompression: 32,

    // Screenshot settings
    screenshotOnRunFailure: true,

    // Timeout settings
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 30000,
    requestTimeout: 10000,
    responseTimeout: 30000,

    // Environment variables
    env: {
      apiUrl: 'http://localhost:3001',
    },
  },

  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}',
  },
});

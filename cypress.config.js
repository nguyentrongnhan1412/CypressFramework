const { defineConfig } = require("cypress");
const path = require('path');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://demoqa.com',
    viewportWidth: 1920,
    viewportHeight: 1080,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 15000,
    requestTimeout: 15000,
    responseTimeout: 15000,
    pageLoadTimeout: 60000,
    chromeWebSecurity: false,
    experimentalMemoryManagement: true,
    numTestsKeptInMemory: 0,
    reporter: 'cypress-mochawesome-reporter',
    reporterOptions: {
      reportDir: 'cypress/reports',
      overwrite: false,
      html: false,
      json: true,
      timestamp: 'mmddyyyy_HHMMss'
    },
    // Explicitly set spec pattern and support file for better module resolution
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',
    setupNodeEvents(on, config) {
      // Mochawesome reporter
      require('cypress-mochawesome-reporter/plugin')(on);
      
      // Block ads and tracking to prevent browser crashes
      on('before:browser:launch', (browser = {}, launchOptions) => {
        if (browser.family === 'chromium' && browser.name !== 'electron') {
          launchOptions.args.push('--disable-features=CrossSiteDocumentBlockingIfIsolating,CrossSiteDocumentBlockingAlways,IsolateOrigins,site-per-process');
          launchOptions.args.push('--disable-site-isolation-trials');
        }

        if (browser.name === 'electron') {
          launchOptions.preferences.webPreferences = {
            ...launchOptions.preferences.webPreferences,
            additionalArguments: [
              '--disable-http-cache',
            ],
          };
        }

        return launchOptions;
      });
      
      // Task for handling file operations if needed
      on('task', {
        log(message) {
          console.log(message);
          return null;
        }
      });

      return config;
    },
  },
});

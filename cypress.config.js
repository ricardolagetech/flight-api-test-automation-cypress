const { defineConfig } = require('cypress');
const dotenv = require('dotenv');

dotenv.config();

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.API_BASE_URL || 'http://localhost:3000',
    specPattern: 'test/**/*.cy.js',
    supportFile: 'test/support/e2e.js',
    fixturesFolder: 'test/fixtures',
    setupNodeEvents(_on, config) {
      config.env.apiBasicUser = process.env.API_BASIC_USER || 'interno';
      config.env.apiBasicPass = process.env.API_BASIC_PASS || 'senha-forte-local';

      return config;
    },
  },
  video: false,
  screenshotOnRunFailure: true,
});
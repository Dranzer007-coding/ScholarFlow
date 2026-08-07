const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.js',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:5000',
  },
  webServer: {
    command: 'npm start',
    url: 'http://localhost:5000/api/health',
    reuseExistingServer: !process.env.CI,
    timeout: 60000,
  },
});

const cp = require('child_process');
const clientPlaywrightVersion = cp.execSync('npx playwright --version').toString().trim().split(' ')[1];

const caps = {
  'browser': 'chrome', // allowed browsers are `chrome`, `edge`, `playwright-chromium`, `playwright-firefox` and `playwright-webkit`
  'os': 'osx',
  'os_version': 'catalina',
  'name': 'Codecept test using Playwright',
  'build': 'CodeceptJS on BrowserStack',
  'browserstack.username': process.env.BROWSERSTACK_USERNAME || 'tanya_o17nXL',
  'browserstack.accessKey': process.env.BROWSERSTACK_ACCESS_KEY || 'NvZipw29wjfTgLaszPqu',
  'client.playwrightVersion': clientPlaywrightVersion  // example '1.11.0'
};

exports.config = {
  tests: 'e2e/test/scenarios/*_test.js',
  output: 'e2e/test/error-screenshots',
  helpers: {
    Playwright: {
      url: process.env.E2E_DOMAIN || 'https://minds.com',
      show: true,
      browser: 'chromium',
      chromium: {
        browserWSEndpoint: { wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify(caps))}` }
      }
    }
  },
  include: {
    I: 'e2e/test/steps/steps_file.js'
  },
  bootstrap: null,
  mocha: {},
  name: 'codeceptjs',
  plugins: {
    pauseOnFail: {},
    retryFailedStep: {
      enabled: true
    },
    tryTo: {
      enabled: true
    },
    screenshotOnFail: {
      enabled: true
    }
  }
}

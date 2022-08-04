const cp = require('child_process');
const clientPlaywrightVersion = cp.execSync('npx playwright --version').toString().trim().split(' ')[1];

require('dotenv').config();

const chromiumCaps = {
  'browser': 'playwright-chromium',
  'os': 'Windows',
  'os_version': '11',
  'resolution': '1440x900',
  'name': 'Minds Web Automation',
  'build': 'Minds Web Smoke-Chrome',
  'browserstack.username': process.env.BROWSERSTACK_USERNAME,
  'browserstack.accessKey': process.env.BROWSERSTACK_ACCESS_KEY,
  'client.playwrightVersion': clientPlaywrightVersion
}

const firefoxCaps = {
  'browser': 'playwright-firefox',
  'os': 'osx',
  'os_version': 'Catalina',
  'resolution': '1024x768',
  'name': 'Minds Web Automation',
  'build': 'Minds Web Smoke-Firefox',
  'browserstack.username': process.env.BROWSERSTACK_USERNAME,
  'browserstack.accessKey': process.env.BROWSERSTACK_ACCESS_KEY,
  'client.playwrightVersion': clientPlaywrightVersion
}

const webkitCaps = {
  'browser': 'playwright-webkit',
  'os': 'osx',
  'os_version': 'Big Sur',
  'resolution': '1920x1080',
  'name': 'Minds Web Automation',
  'build': 'Minds Web Smoke-Safari',
  'browserstack.username': process.env.BROWSERSTACK_USERNAME,
  'browserstack.accessKey': process.env.BROWSERSTACK_ACCESS_KEY,
  'client.playwrightVersion': clientPlaywrightVersion
}

exports.config = {
  output: '../error-screenshots',
  helpers: {
    Playwright: {
      url: process.env.E2E_DOMAIN || 'https://minds.com',
      show: true,
      video: true,
      browser: [],
      retries: 2,
      restart: "session",
      reporter: 'html',

      chromium: {
        browserWSEndpoint: { wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify(chromiumCaps))}` }
       },
       firefox: {
        browserWSEndpoint: { wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify(firefoxCaps))}` }
       },
       webkit: {
        browserWSEndpoint: { wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify(webkitCaps))}` }
       }
    }
    },
  multiple: {
    browserStackCombo: {    
      browsers: ['firefox', 'chromium', 'webkit'],
    },
  },
  include: {
    I: '../step_definitions/steps_file.js',
    loginPage: '../pages/login.page.js'
  },
  mocha: {},
  bootstrap: null,
  teardown: null,
  gherkin: {
    features: "../features/*.feature",
    steps: [
        "../steps/login-steps.js",
    ]
  },
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
  },
  name: 'minds-real-testing-project'
}

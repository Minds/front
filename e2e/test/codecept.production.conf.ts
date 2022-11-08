import { setHeadlessWhen, setCommonPlugins } from '@codeceptjs/configure';
// turn on headless mode when running with HEADLESS=true environment variable
// export HEADLESS=true && npx codeceptjs run
setHeadlessWhen(process.env.HEADLESS);

// enable all common plugins https://github.com/codeceptjs/configure#setcommonplugins
setCommonPlugins();

require('dotenv').config();

const cp = require('child_process');
const clientPlaywrightVersion = cp
  .execSync('npx playwright --version')
  .toString()
  .trim()
  .split(' ')[1];

const chromiumCaps = {
  browser: 'playwright-chromium',
  os: 'Windows',
  os_version: '11',
  resolution: '1440x900',
  name: 'Minds Web Automation',
  build: 'Minds Web Smoke-Chrome',
  'browserstack.username': process.env.BROWSERSTACK_USERNAME,
  'browserstack.accessKey': process.env.BROWSERSTACK_ACCESS_KEY,
  'client.playwrightVersion': clientPlaywrightVersion,
};

// const firefoxCaps = {
//   browser: 'playwright-firefox',
//   os: 'osx',
//   os_version: 'Catalina',
//   resolution: '1024x768',
//   name: 'Minds Web Automation',
//   build: 'Minds Web Smoke-Firefox',
//   'browserstack.username': process.env.BROWSERSTACK_USERNAME,
//   'browserstack.accessKey': process.env.BROWSERSTACK_ACCESS_KEY,
//   'client.playwrightVersion': clientPlaywrightVersion,
// };

// const webkitCaps = {
//   browser: 'playwright-webkit',
//   os: 'osx',
//   os_version: 'Big Sur',
//   resolution: '1920x1080',
//   name: 'Minds Web Automation',
//   build: 'Minds Web Smoke-Safari',
//   'browserstack.username': process.env.BROWSERSTACK_USERNAME,
//   'browserstack.accessKey': process.env.BROWSERSTACK_ACCESS_KEY,
//   'client.playwrightVersion': clientPlaywrightVersion,
// };

export const config: CodeceptJS.MainConfig = {
  tests: './step_definitions/*-steps.ts',
  output: './error-screenshots',
  helpers: {
    Playwright: {
      url: process.env.E2E_DOMAIN || 'https://minds.com',
      show: true,
      video: true,
      browser: 'chromium',
      restart: 'session',
      chromium: {
        browserWSEndpoint: {
          wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(
            JSON.stringify(chromiumCaps)
          )}`,
        },
      },
      // firefox: {
      //   browserWSEndpoint: {
      //     wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(
      //       JSON.stringify(firefoxCaps)
      //     )}`,
      //   },
      // },
      // webkit: {
      //   browserWSEndpoint: {
      //     wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(
      //       JSON.stringify(webkitCaps)
      //     )}`,
      //   },
      // },
    },
    CookieHelper: {
      require: './helpers/cookie-helper.ts',
    },
  },
  // multiple: {
  //   browserStackCombo: {
  //     browsers: ['firefox', 'chromium', 'webkit'],
  //   },
  // },
  include: {
    // pages
    activityFeedPage: './pages/activityFeedPage.ts',
    boostMarketingPage: './pages/boostMarketingPage.ts',
    boostPage: './pages/boostPage.ts',
    channelPage: './pages/channelPage.ts',
    commonPage: './pages/commonPage.ts',
    devtoolsPage: './pages/devtoolsPage.ts',
    loginPage: './pages/loginPage.ts',
    newsfeedPage: './pages/newsfeedPage.ts',
    registerPage: './pages/registerPage.ts',
    rewardsMarketingPage: './pages/rewardsMarketingPage.ts',
    searchPage: './pages/searchPage.ts',
    settingsPage: './pages/settingsPage.ts',
    singleEntityPage: './pages/singleEntityPage.ts',
    supermindConsolePage: './pages/supermindConsolePage.ts',
    supermindSettingsPage: './pages/supermindSettingsPage.ts',
    tokenMarketingPage: './pages/tokenMarketingPage.ts',
    // fragments
    composerModalComponent: './fragments/composerModalComponent.ts',
    activityComponent: './fragments/activityComponent.ts',
    activityModalComponent: './fragments/activityModalComponent.ts',
    boostRotatorComponent: './fragments/boostRotatorComponent.ts',
    confirmationModalComponent: './fragments/confirmationModalComponent.ts',
    notificationsComponent: './fragments/notificationsComponent.ts',
    sidebarComponent: './fragments/sidebarComponent.ts',
    supermindOnboardingModalComponent:
      './fragments/supermindOnboardingModalComponent.ts',
    topbarComponent: './fragments/topbarComponent.ts',
  },
  name: 'Minds Codecept E2E tests',
  gherkin: {
    features: './features/*.feature',
    steps: [
      './step_definitions/activity-feed-steps.ts',
      './step_definitions/activity-modal-steps.ts',
      './step_definitions/activity-steps.ts',
      './step_definitions/boost-display-steps.ts',
      './step_definitions/boostmarketing-steps.ts',
      './step_definitions/boost-steps.ts',
      './step_definitions/channel-steps.ts',
      './step_definitions/common-steps.ts',
      './step_definitions/composer-steps.ts',
      './step_definitions/devtools-steps.ts',
      './step_definitions/login-steps.ts',
      './step_definitions/newsfeed-steps.ts',
      './step_definitions/notification-steps.ts',
      './step_definitions/payments-steps.ts',
      './step_definitions/rewardsmarketing-steps.ts',
      './step_definitions/search-steps.ts',
      './step_definitions/settings-steps.ts',
      './step_definitions/supermind-console-steps.ts',
      './step_definitions/supermind-settings-steps.ts',
      './step_definitions/supermind-steps.ts',
      './step_definitions/tokenmarketing-steps.ts',
    ],
  },
  plugins: {
    pauseOnFail: {},
    retryFailedStep: {
      enabled: true,
    },
    tryTo: {
      enabled: true,
    },
    screenshotOnFail: {
      enabled: true,
    },
  },
};

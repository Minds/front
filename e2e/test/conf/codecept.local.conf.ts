require('ts-node/register');
require('dotenv').config();

exports.config = {
  output: '../error-screenshots',
  helpers: {
    Playwright: {
      url: process.env.E2E_DOMAIN || 'https://minds.com',
      show: false,
      video: true,
      browser: 'chromium',
      retries: 2,
      restart: 'session',
      reporter: 'html',
      keepCookies: true,
      keepBrowserState: true,
      waitForNavigation: 'domcontentloaded',
    },
  },
  include: {
    I: '../step_definitions/steps_file.ts',
    boostMarketingPage: '../pages/boostMarketingPage.ts',
    boostPage: '../pages/boostPage.ts',
    devtoolsPage: '../pages/devtoolsPage.ts',
    loginPage: '../pages/loginPage.ts',
    newsfeedPage: '../pages/newsfeedPage.ts',
    rewardsMarketingPage: '../pages/rewardsMarketingPage.ts',
    searchPage: '../pages/searchPage.ts',
    settingsPage: '../pages/settingsPage.ts',
    supermindConsolePage: '../pages/supermindConsolePage.ts',
    supermindSettingsPage: '../pages/supermindSettingsPage.ts',
    tokenMarketingPage: '../pages/tokenMarketingPage.ts',
    channelPage: '../pages/channelPage.ts',
    activityFeedPage: '../pages/activityFeedPage.ts',
  },
  mocha: {},
  bootstrap: null,
  teardown: null,
  gherkin: {
    features: '../features/*.feature',
    steps: '../steps/*-steps.ts',
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
  name: 'minds-local-testing-project',
};

import { setHeadlessWhen, setCommonPlugins } from '@codeceptjs/configure';
// turn on headless mode when running with HEADLESS=true environment variable
// export HEADLESS=true && npx codeceptjs run
setHeadlessWhen(process.env.HEADLESS);

// enable all common plugins https://github.com/codeceptjs/configure#setcommonplugins
setCommonPlugins();

require('dotenv').config();

export const config: CodeceptJS.MainConfig = {
  tests: './step_definitions/*-steps.ts',
  output: './error-screenshots',
  helpers: {
    Playwright: {
      url: process.env.E2E_DOMAIN || 'https://minds.com/',
      show: false,
      video: true,
      browser: 'chromium',
      restart: 'session',
      keepCookies: true,
      keepBrowserState: true,
      waitForNavigation: 'domcontentloaded',
      timeout: 10000,
      waitForTimeout: 10000,
      trace: true,
    },
    CookieHelper: {
      require: './helpers/cookie-helper.ts',
    },
  },
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
      retries: 3,
    },
    tryTo: {
      enabled: true,
    },
    screenshotOnFail: {
      enabled: true,
    },
  },
};

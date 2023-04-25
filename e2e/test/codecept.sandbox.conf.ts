import { setCommonPlugins, setHeadlessWhen } from '@codeceptjs/configure';
// turn on headless mode when running with HEADLESS=true environment variable
// export HEADLESS=true && npx codeceptjs run
setHeadlessWhen(process.env.HEADLESS);

// enable all common plugins https://github.com/codeceptjs/configure#setcommonplugins
setCommonPlugins();

require('dotenv').config();

type CustomMainConfig = Omit<CodeceptJS.MainConfig, 'gherkin'> & {
  gherkin: {
    features: string | Array<string>;
    steps: string | Array<string>;
  };
};

export const config: CustomMainConfig = {
  tests: './steps/*-steps.ts',
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
      timeout: 30000,
      waitForTimeout: 30000,
      getPageTimeout: 30000,
      trace: true,
      userAgent: 'mindsbot',
    },
    CookieHelper: {
      require: './helpers/cookie-helper.ts',
    },
    CommonHelper: {
      require: './helpers/common-helper.ts',
    },
  },
  include: {
    // pages
    activityFeedPage: './pages/activityFeedPage.ts',
    boostMarketingPage: './pages/boostMarketingPage.ts',
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
    boostConsolePage: './pages/boostConsolePage.ts',
    supermindConsolePage: './pages/supermindConsolePage.ts',
    supermindSettingsPage: './pages/supermindSettingsPage.ts',
    walletPage: './pages/walletPage.ts',
    tokenMarketingPage: './pages/tokenMarketingPage.ts',
    // fragments
    composerModalComponent: './fragments/composerModalComponent.ts',
    activityComponent: './fragments/activityComponent.ts',
    activityModalComponent: './fragments/activityModalComponent.ts',
    boostRotatorComponent: './fragments/boostRotatorComponent.ts',
    confirmationModalComponent: './fragments/confirmationModalComponent.ts',
    modalComponent: './fragments/modalComponent.ts',
    notificationsComponent: './fragments/notificationsComponent.ts',
    sidebarComponent: './fragments/sidebarComponent.ts',
    supermindOnboardingModalComponent:
      './fragments/supermindOnboardingModalComponent.ts',
    topbarComponent: './fragments/topbarComponent.ts',
    feedNoticeComponent: './fragments/feedNoticeComponent.ts',
    boostModalComponent: './fragments/boostModalComponent.ts',
  },
  name: 'Minds Codecept E2E tests',
  gherkin: {
    features: './features/*.feature',
    steps: './steps/*-steps.ts',
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

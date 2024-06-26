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

const firefoxCaps = {
  browser: 'playwright-firefox',
  os: 'osx',
  os_version: 'Catalina',
  resolution: '1024x768',
  name: 'Minds Web Automation',
  build: 'Minds Web Smoke-Firefox',
  'browserstack.username': process.env.BROWSERSTACK_USERNAME,
  'browserstack.accessKey': process.env.BROWSERSTACK_ACCESS_KEY,
  'client.playwrightVersion': clientPlaywrightVersion,
};

const webkitCaps = {
  browser: 'playwright-webkit',
  os: 'osx',
  os_version: 'Big Sur',
  resolution: '1920x1080',
  name: 'Minds Web Automation',
  build: 'Minds Web Smoke-Safari',
  'browserstack.username': process.env.BROWSERSTACK_USERNAME,
  'browserstack.accessKey': process.env.BROWSERSTACK_ACCESS_KEY,
  'client.playwrightVersion': clientPlaywrightVersion,
};

export const config: CustomMainConfig = {
  tests: './steps/*-steps.ts',
  output: './error-screenshots',
  helpers: {
    Playwright: {
      url: process.env.E2E_DOMAIN || 'https://minds.com',
      show: true,
      video: true,
      browser: process.env.profile || 'chromium',
      restart: 'session',
      userAgent: 'mindsbot',
      chromium: {
        browserWSEndpoint: {
          wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(
            JSON.stringify(chromiumCaps)
          )}`,
        },
      },
      firefox: {
        browserWSEndpoint: {
          wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(
            JSON.stringify(firefoxCaps)
          )}`,
        },
      },
      webkit: {
        browserWSEndpoint: {
          wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(
            JSON.stringify(webkitCaps)
          )}`,
        },
      },
    },
    CookieHelper: {
      require: './helpers/cookie-helper.ts',
    },
    CommonHelper: {
      require: './helpers/common-helper.ts',
    },
  },
  multiple: {
    browserStackCombo: {
      browsers: ['firefox', 'chromium', 'webkit'],
    },
  },
  include: {
    // pages
    activityFeedPage: './pages/activityFeedPage.ts',
    boostMarketingPage: './pages/boostMarketingPage.ts',
    channelPage: './pages/channelPage.ts',
    commonPage: './pages/commonPage.ts',
    devtoolsPage: './pages/devtoolsPage.ts',
    groupPage: './pages/groupPage.ts',
    groupsMembershipPage: './pages/groupsMembershipPage.ts',
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
    walletCreditsPage: './pages/walletCreditsPage.ts',
    tokenMarketingPage: './pages/tokenMarketingPage.ts',
    chatPage: './pages/chatPage.ts',
    // fragments
    composerModalComponent: './fragments/composerModalComponent.ts',
    activityComponent: './fragments/activityComponent.ts',
    activityModalComponent: './fragments/activityModalComponent.ts',
    boostRotatorComponent: './fragments/boostRotatorComponent.ts',
    confirmationModalComponent: './fragments/confirmationModalComponent.ts',
    modalComponent: './fragments/modalComponent.ts',
    notificationsComponent: './fragments/notificationsComponent.ts',
    sidebarComponent: './fragments/sidebarComponent.ts',
    explainerScreenModalComponent:
      './fragments/explainerScreenModalComponent.ts',
    topbarComponent: './fragments/topbarComponent.ts',
    feedNoticeComponent: './fragments/feedNoticeComponent.ts',
    boostModalComponent: './fragments/boostModalComponent.ts',
    contentSettingsComponent: './fragments/contentSettingsComponent.ts',
    multiFactorModalComponent: './fragments/multiFactorModalComponent.ts',
    publisherRecommendationsModalComponent:
      './fragments/publisherRecommendationsModalComponent.ts',
    reportModalComponent: './fragments/reportModalComponent.ts',
    upgradeModalComponent: './fragments/upgradeModalComponent.ts',
    onboardingV5ModalComponent:
      './fragments/onboardingV5/onboardingV5ModalComponent.ts',
    onboardingV5VerifyEmailComponent:
      './fragments/onboardingV5/onboardingV5VerifyEmailComponent.ts',
    onboardingV5TagSelectorComponent:
      './fragments/onboardingV5/onboardingV5TagSelectorComponent.ts',
    onboardingV5SurveyComponent:
      './fragments/onboardingV5/onboardingV5SurveyComponent.ts',
    onboardingV5PublisherRecsComponent:
      './fragments/onboardingV5/onboardingV5PublisherRecsComponent.ts',
    onboardingV5CompletionPanelComponent:
      './fragments/onboardingV5/onboardingV5CompletionPanelComponent.ts',
    chatRoomListComponent: './fragments/chatRoomListComponent.ts',
    chatRoomComponent: './fragments/chatRoomComponent.ts',
    createNewChatModalComponent: './fragments/createNewChatModalComponent.ts',
  },
  name: 'Minds Codecept E2E tests',
  gherkin: {
    features: './features/*.feature',
    steps: './steps/**/*-steps.ts',
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

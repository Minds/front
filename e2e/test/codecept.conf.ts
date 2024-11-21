require('ts-node/register');

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
      show: true,
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
      retries: 10,
    },
    tryTo: {
      enabled: true,
    },
    screenshotOnFail: {
      enabled: true,
    },
  },
};

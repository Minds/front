/// <reference types='codeceptjs' />
//type steps_file = typeof import('./steps_file');
type boostMarketingPage = typeof import('../pages/boostMarketingPage');
type boostPage = typeof import('../pages/boostPage');
type commonPage = typeof import('../pages/commonPage');
type composerModal = typeof import('../pages/composerModal');
type devtoolsPage = typeof import('../pages/devtoolsPage');
type loginPage = typeof import('../pages/loginPage');
type newsfeedPage = typeof import('../pages/newsfeedPage');
type rewardsMarketingPage = typeof import('../pages/rewardsMarketingPage');
type searchPage = typeof import('../pages/searchPage');
type settingsPage = typeof import('../pages/settingsPage');
type tokenMarketingPage = typeof import('../pages/tokenMarketingPage');
type channelPage = typeof import('../pages/channelPage');

declare namespace CodeceptJS {
  interface SupportObject {
    I: I;
    loginPage: loginPage;
    boostMarketingPage: boostMarketingPage;
    boostPage: boostPage;
    devtoolsPage: devtoolsPage;
    commonPage: commonPage;
    composerModal: composerModal;
    newsfeedPage: newsfeedPage;
    rewardsMarketingPage: rewardsMarketingPage;
    searchPage: searchPage;
    settingsPage: settingsPage;
    tokenMarketingPage: tokenMarketingPage;
    channelPage: channelPage;
    current: any;
  }
  interface Methods extends Playwright {}
  interface I extends WithTranslation<Methods> {}
  namespace Translation {
    interface Actions {}
  }
}

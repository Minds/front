/// <reference types='codeceptjs' />
type activityFeedPage = typeof import('./pages/activityFeedPage');
type boostMarketingPage = typeof import('./pages/boostMarketingPage');
type channelPage = typeof import('./pages/channelPage');
type commonPage = typeof import('./pages/commonPage');
type devtoolsPage = typeof import('./pages/devtoolsPage');
type loginPage = typeof import('./pages/loginPage');
type newsfeedPage = typeof import('./pages/newsfeedPage');
type registerPage = typeof import('./pages/registerPage');
type rewardsMarketingPage = typeof import('./pages/rewardsMarketingPage');
type searchPage = typeof import('./pages/searchPage');
type settingsPage = typeof import('./pages/settingsPage');
type singleEntityPage = typeof import('./pages/singleEntityPage');
type supermindConsolePage = typeof import('./pages/supermindConsolePage');
type supermindSettingsPage = typeof import('./pages/supermindSettingsPage');
type tokenMarketingPage = typeof import('./pages/tokenMarketingPage');
type composerModalComponent = typeof import('./fragments/composerModalComponent');
type activityComponent = typeof import('./fragments/activityComponent');
type activityModalComponent = typeof import('./fragments/activityModalComponent');
type boostRotatorComponent = typeof import('./fragments/boostRotatorComponent');
type confirmationModalComponent = typeof import('./fragments/confirmationModalComponent');
type notificationsComponent = typeof import('./fragments/notificationsComponent');
type sidebarComponent = typeof import('./fragments/sidebarComponent');
type supermindOnboardingModalComponent = typeof import('./fragments/supermindOnboardingModalComponent');
type topbarComponent = typeof import('./fragments/topbarComponent');
type feedNoticeComponent = typeof import('./fragments/feedNoticeComponent');
type modalComponent = typeof import('./fragments/modalComponent');
type boostModalComponent = typeof import('./fragments/boostModalComponent');
type CookieHelper = import('./helpers/cookie-helper');
type CommonHelper = import('./helpers/common-helper');

declare namespace CodeceptJS {
  interface SupportObject {
    I: I;
    current: any;
    activityFeedPage: activityFeedPage;
    boostMarketingPage: boostMarketingPage;
    channelPage: channelPage;
    commonPage: commonPage;
    devtoolsPage: devtoolsPage;
    loginPage: loginPage;
    newsfeedPage: newsfeedPage;
    registerPage: registerPage;
    rewardsMarketingPage: rewardsMarketingPage;
    searchPage: searchPage;
    settingsPage: settingsPage;
    singleEntityPage: singleEntityPage;
    supermindConsolePage: supermindConsolePage;
    supermindSettingsPage: supermindSettingsPage;
    tokenMarketingPage: tokenMarketingPage;
    composerModalComponent: composerModalComponent;
    activityComponent: activityComponent;
    activityModalComponent: activityModalComponent;
    boostRotatorComponent: boostRotatorComponent;
    confirmationModalComponent: confirmationModalComponent;
    notificationsComponent: notificationsComponent;
    sidebarComponent: sidebarComponent;
    supermindOnboardingModalComponent: supermindOnboardingModalComponent;
    topbarComponent: topbarComponent;
    feedNoticeComponent: feedNoticeComponent;
    modalComponent: modalComponent;
    boostModalComponent: boostModalComponent;
  }
  interface Methods extends Playwright, CookieHelper, CommonHelper {}
  interface I extends WithTranslation<Methods> {}
  namespace Translation {
    interface Actions {}
  }
}

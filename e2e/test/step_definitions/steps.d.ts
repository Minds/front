/// <reference types='codeceptjs' />
//type steps_file = typeof import('./steps_file');
type loginPage = typeof import('../pages/loginPage');
type devtoolsPage = typeof import('../pages/devtoolsPage');
type newsfeedPage = typeof import('../pages/newsfeedPage');
type commonPage = typeof import('../pages/commonPage');
type composerModal = typeof import('../pages/composerModal');

declare namespace CodeceptJS {
  interface SupportObject {
    I: I;
    loginPage: loginPage;
    devtoolsPage: devtoolsPage;
    newsfeedPage: newsfeedPage;
    commonPage: commonPage;
    composerModal: composerModal;
    current: any;
  }
  interface Methods extends Playwright {}
  interface I extends WithTranslation<Methods> {}
  namespace Translation {
    interface Actions {}
  }
}

/// <reference types='codeceptjs' />
type steps_file = typeof import('./steps_file.ts');
type loginPage = typeof import('../pages/loginPage');
type devtoolsPage = typeof import('../pages/devtoolsPage');

declare namespace CodeceptJS {
  interface SupportObject {
    I: I;
    loginPage: loginPage;
    devtoolsPage: devtoolsPage;
    current: any;
  }
  interface Methods extends Playwright {}
  interface I extends ReturnType<steps_file> {}
  namespace Translation {
    interface Actions {}
  }
}

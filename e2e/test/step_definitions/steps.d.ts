/// <reference types='codeceptjs' />
type steps_file = typeof import('./steps_file.ts');
type LoginPageType = typeof import('../pages/loginPage');
type DevtoolsPageType = typeof import('../pages/devtoolsPage');

declare namespace CodeceptJS {
  interface SupportObject {
    I: I;
    loginPage: LoginPageType;
    devtoolsPage: DevtoolsPageType;
    current: any;
  }
  interface Methods extends Playwright {}
  interface I extends ReturnType<steps_file> {}
  namespace Translation {
    interface Actions {}
  }
}

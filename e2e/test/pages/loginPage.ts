const { I } = inject();

class LoginPage {
  loginURI = '/login';
  validUsername = process.env.PLAYWRIGHT_USERNAME;
  validPassword = process.env.PLAYWRIGHT_PASSWORD;

  authModalSelector: string = 'm-auth__modal';
  login(username, password) {
    I.waitForElement(this.authModalSelector);
    I.setRateLimitBypassCookie();
    I.seeElement('#username');
    I.fillField('#username', username);
    I.seeElement('#password');
    I.fillField('#password', password);
    I.click(locate('button').withText('Login'));
  }
}

export = new LoginPage();

require('dotenv').config();
const { I } = inject();

export = {
  loginURI: '/login',
  validUsername: process.env.PLAYWRIGHT_USERNAME,
  validPassword: process.env.PLAYWRIGHT_PASSWORD,

  login(username, password) {
    I.seeElement('#username');
    I.fillField('#username', username);
    I.seeElement('#password');
    I.fillField('#password', password);

    I.click(locate('button').withText('Login'));
  },

  waitForLoginResponse(): void {
    I.waitForResponse(process.env.E2E_DOMAIN + 'api/v1/authenticate', 10);
  },
};

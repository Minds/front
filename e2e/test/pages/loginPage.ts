import { Helpers } from '../helpers/helpers';

require('dotenv').config();
const { I } = inject();
const helpers = new Helpers();

export = {
  loginURI: '/login',
  validUsername: process.env.PLAYWRIGHT_USERNAME,
  validPassword: process.env.PLAYWRIGHT_PASSWORD,

  login(username, password) {
    helpers.setRateLimitBypassCookie();

    I.seeElement('#username');
    I.fillField('#username', username);
    I.seeElement('#password');
    I.fillField('#password', password);
    I.click(locate('button').withText('Login'));
  },
};

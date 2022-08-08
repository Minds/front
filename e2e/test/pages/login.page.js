require('dotenv').config();
const { I } = inject();

class LoginPage {
  constructor() {
    this.validUsername = process.env.PLAYWRIGHT_USERNAME;
    this.validPassword = process.env.PLAYWRIGHT_PASSWORD;
  }
  async login(username, password) {
    I.seeElement('#username');
    I.fillField('#username', username); 
    I.seeElement('#password');
    I.fillField('#password', password);
    I.click(locate('button').withText('Login'));
  }
}

module.exports = new LoginPage();

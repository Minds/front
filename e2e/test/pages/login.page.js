require('dotenv').config();
const { I } = inject();

class LoginPage {
  constructor() {
    this.username = process.env.PLAYWRIGHT_USERNAME;
    this.password = process.env.PLAYWRIGHT_PASSWORD;
  }
}

export default new LoginPage();

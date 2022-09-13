import CommonPage from '../pages/commonPage';

namespace CommonSteps {
  const { I, loginPage, newsfeedPage } = inject();

  const commonPage = new CommonPage();

  Given(
    'I am logged in',
    async (): Promise<void> => {
      if (await I.grabCookie('minds_sess')) {
        return;
      }

      I.amOnPage(loginPage.loginURI);
      loginPage.login(loginPage.validUsername, loginPage.validPassword);
      I.seeCookie('minds_sess');
    }
  );

  Given(
    'I am logged in as {string}',
    async (username: string): Promise<void> => {
      I.clearCookie();

      let password;

      switch (username) {
        case process.env.SUPERMIND_SENDER_USERNAME:
          password = process.env.SUPERMIND_SENDER_PASSWORD;
          break;
        default:
          password = process.env.PLAYWRIGHT_PASSWORD;
          break;
      }

      I.amOnPage(loginPage.loginURI);
      loginPage.login(username, password);
      I.seeCookie('minds_sess');
    }
  );

  When('I switch users to {string}', (username: string) => {
    I.clearCookie();

    let password;

    switch (username) {
      case process.env.SUPERMIND_SENDER_USERNAME:
        password = process.env.SUPERMIND_SENDER_PASSWORD;
        break;
      default:
        password = process.env.PLAYWRIGHT_PASSWORD;
        break;
    }

    I.amOnPage(loginPage.loginURI);
    loginPage.login(username, password);
    I.seeCookie('minds_sess');
  });

  Given('I am logged out', (): void => {
    I.clearCookie('minds_sess');
  });

  Given('I am on the newsfeed', () => {
    I.amOnPage(newsfeedPage.newsfeedURI);
  });

  //

  Then(
    'I should see an {string} toaster saying {string}',
    (toasterType, toasterText) => {
      I.see(toasterText, commonPage.toaster);
      I.seeElement(`${commonPage.toasterTypePrefix}${toasterType}`);
    }
  );

  Then('I should see {string} in current URL', (path: string) => {
    I.seeInCurrentUrl(path);
  });
}

import { CommonPage } from '../pages/commonPage';
import { NewsfeedPage } from '../pages/newsfeedPage';

namespace CommonSteps {
  const { I, loginPage } = inject();

  const commonPage = new CommonPage();
  const newsfeedPage = new NewsfeedPage();

  /**
   * Log in with standard test user - will not re-log in if cookie is present.
   * Do not to switch users.
   * @return { Promise<void> }
   */
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

  /**
   * Will clear cookies and login as the specified user - useful for user switching.
   * @param { string } username - username to log in as.
   * @return { void }
   */
  Given('I log in as {string}', (username: string): void => {
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

  Given('I am on the {string} channel page', username => {
    I.amOnPage('/' + username);
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

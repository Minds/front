import { Helpers } from '../helpers/helpers';
import CommonPage from '../pages/commonPage';
import RegisterPage from '../pages/registerPage';

namespace CommonSteps {
  const { I, loginPage, newsfeedPage } = inject();

  const commonPage = new CommonPage();
  const helpers = new Helpers();
  const registerPage = new RegisterPage();

  /**
   * Create a new user.
   * @return { void }
   */
  Given('I create a new user', (): void => {
    const username = helpers.generateRandomString();
    const email = 'noreply@minds.com';
    const password = helpers.generateRandomString() + 'A1!';

    I.clearCookie();
    registerPage.navigateToByUrl();
    registerPage.fillForm(username, password, email);
    registerPage.clickJoinNow();

    I.waitForNavigation({ timeout: 30000 });
    // TODO: Handle email code verification.
  });

  /**
   * Log in with standard test user - will not re-log in if cookie is present.
   * Is not not meant to switch users.
   * @return { Promise<void> }
   */
  Given(
    'I am logged in',
    async (): Promise<void> => {
      I.clearCookie();
      I.amOnPage(loginPage.loginURI);

      await Promise.all([
        loginPage.login(loginPage.validUsername, loginPage.validPassword),
        I.waitForResponse(
          resp =>
            resp.url().includes('/api/v2/mwa/pv') && resp.status() === 200,
          30
        ),
      ]);

      I.seeCookie('minds_sess');
    }
  );

  /**
   * Will clear cookies and login as the specified user - useful for user switching.
   * @param { string } username - username to log in as.
   * @return { void }
   */
  Given('I log in as {string}', (username: string): void => {
    let password;

    switch (username) {
      case process.env.SUPERMIND_SENDER_USERNAME:
        password = process.env.SUPERMIND_SENDER_PASSWORD;
        break;
      default:
        password = process.env.PLAYWRIGHT_PASSWORD;
        break;
    }

    I.clearCookie();
    I.amOnPage(loginPage.loginURI);
    loginPage.login(username, password);
    I.waitForNavigation({ timeout: 30000 });
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

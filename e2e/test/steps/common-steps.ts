import { ConfirmationModalComponent } from '../components/confirmationModalComponent';
import { Helpers } from '../helpers/helpers';
import { CommonPage } from '../pages/commonPage';
import { NewsfeedPage } from '../pages/newsfeedPage';
import { RegisterPage } from '../pages/registerPage';

namespace CommonSteps {
  const { I, loginPage } = inject();

  const commonPage = new CommonPage();
  const helpers = new Helpers();
  const registerPage = new RegisterPage();
  const confirmationModalComponent = new ConfirmationModalComponent();

  Before(() => {});

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
   * Note: this requires that the modal is using m-modalCloseButton
   */
  Given(
    'I close the {string} modal',
    async (modalSelector: string): Promise<void> => {
      const modal = locate(modalSelector);
      const modalVisible = await I.grabNumberOfVisibleElements(modal);

      // We only want to close the modal if it exists
      if (modalVisible) {
        const closeButton = locate('[data-ref=modal-close-button]');
        const closeButtonVisible = await I.grabNumberOfVisibleElements(
          closeButton
        );

        if (closeButtonVisible) {
          const modalCloseButton = closeButton.inside(modal);
          I.click(modalCloseButton);
          return;
        }
      }
    }
  );

  /**
   * Log in with standard test user - will not re-log in if cookie is present.
   * Is not not meant to switch users.
   * @return { Promise<void> }
   */
  Given(
    'I am logged in',
    async (): Promise<void> => {
      if (await I.grabCookie('minds_sess')) {
        return;
      }

      I.clearCookie();
      I.refreshPage();
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
  Given('I log in as {string}', (_username: string): void => {
    let username: string = _username,
      password: string;

    switch (username) {
      case 'supermind_sender':
        username = process.env.SUPERMIND_SENDER_USERNAME || '';
        password = process.env.SUPERMIND_SENDER_PASSWORD || '';
        break;
      case process.env.SUPERMIND_SETTINGS_USERNAME:
        password = process.env.SUPERMIND_SETTINGS_PASSWORD || '';
        break;
      default:
        username = process.env.PLAYWRIGHT_USERNAME || '';
        password = process.env.PLAYWRIGHT_PASSWORD || '';
        break;
    }

    if (!username || !password) {
      throw 'Invalid credentials provided for ' + _username;
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

  Given('I am on the {string} channel page', username => {
    I.amOnPage('/' + username);
  });

  Given('I wait for {string} seconds', (seconds: number) => {
    I.wait(seconds);
  });

  When('I click the cancel button on the confirmation modal', () => {
    confirmationModalComponent.clickCancel();
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

  Then('I clear my cookies', () => {
    I.clearCookie();
    I.refreshPage();
  });

  After(() => {});
}

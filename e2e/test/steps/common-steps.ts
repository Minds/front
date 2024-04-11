import assert from 'assert';
import modalComponent from '../fragments/modalComponent';
import { generateARandomString } from '../utils/utils';

namespace CommonSteps {
  const {
    I,
    loginPage,
    commonPage,
    registerPage,
    channelPage,
    confirmationModalComponent,
    onboardingV5ModalComponent,
    upgradeModalComponent,
    explainerScreenModalComponent,
    topbarComponent,
  } = inject();

  /**
   * Create a new user.
   * @return { void }
   */
  Given('I create a new user', async (): Promise<void> => {
    const username = generateARandomString();
    const email = 'noreply@minds.com';
    const password = generateARandomString() + 'A1!';

    I.clearCookie();
    registerPage.navigateToByUrl();
    registerPage.setupRegistrationBypassCookies();
    registerPage.fillForm(username, password, email);
    registerPage.clickJoinNow();

    I.waitForNavigation({ timeout: 30000 });

    await onboardingV5ModalComponent.completeOnboarding();
    upgradeModalComponent.isVisible();
    upgradeModalComponent.dismiss();
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
        const closeButtonVisible =
          await I.grabNumberOfVisibleElements(closeButton);

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
  Given('I am logged in', async (): Promise<void> => {
    if (await I.grabCookie('minds_sess')) {
      return;
    }
    I.clearCookie();
    I.refreshPage();
    I.amOnPage(loginPage.loginURI);

    await Promise.all([
      loginPage.login(loginPage.validUsername, loginPage.validPassword),
      I.waitForResponse(
        (resp) =>
          resp.url().includes('/api/v2/mwa/pv') && resp.status() === 200,
        30
      ),
    ]);

    I.seeCookie('minds_sess');
  });

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
      case process.env.PLAYWRIGHT_SECONDARY_USERNAME:
        password = process.env.PLAYWRIGHT_SECONDARY_PASSWORD || '';
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

  Given('I am on the {string} channel page', (username) => {
    I.amOnPage('/' + username);
    channelPage.waitForContentComponent();
  });

  Given('I wait for {string} seconds', (seconds: number) => {
    I.wait(seconds);
  });

  Given('I navigate to {string}', (path: string) => {
    I.amOnPage(path);
  });

  //

  When('I see an explainer screen modal', () => {
    explainerScreenModalComponent.shouldBeVisible(true);
  });

  When('I click the action button in the explainer screen modal', () => {
    explainerScreenModalComponent.clickContinue();
  });

  When('I click the cancel button on the confirmation modal', () => {
    confirmationModalComponent.clickCancel();
  });

  When('I accept the system confirmation dialog', () => {
    I.acceptPopup();
  });

  When('I cancel the system confirmation dialog', () => {
    I.cancelPopup();
  });

  When('I refresh the page', () => {
    I.refreshPage();
  });

  //

  Then(
    'I should see an {string} toaster saying {string}',
    (toasterType, toasterText) => {
      I.waitForElement(`${commonPage.toasterTypePrefix}${toasterType}`);
      I.see(toasterText, commonPage.toaster);
    }
  );

  Then('I should see {string} in current URL', (path: string) => {
    I.seeInCurrentUrl(path);
  });

  Then('I clear my cookies', () => {
    I.clearCookie();
    I.refreshPage();
  });

  Then('I see the {string} modal', (selector: string) => {
    modalComponent.isVisible(locate(selector));
  });

  Then('I should see an explainer screen modal', (num) => {
    explainerScreenModalComponent.shouldBeVisible(true);
  });

  Then('I see my avatar in the topbar', async () => {
    await topbarComponent.verifyAvatarImageIsValid();
  });

  // Debug helper
  Then('I pause', () => {
    pause();
  });
}

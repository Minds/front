import { Helpers } from '../helpers/helpers';

require('dotenv').config();
const { I } = inject();
const helpers = new Helpers();

/**
 * Register page.
 */
class RegisterPage {
  // Selectors
  private readonly url: string = '/register';
  private readonly usernameSelector: string = '#username';
  private readonly emailSelector: string = '#email';
  private readonly passwordSelector: string = '#password';
  private readonly password2Selector: string = '#password2';
  private readonly acceptTosSelector: string =
    '[data-cy=minds-accept-tos-input] .m-formInputCheckbox__custom';
  private readonly selectButtonSelector: string = '[type="submit"]';

  /**
   * Navigate to page by URL.
   * @return { void }
   */
  public navigateToByUrl(): void {
    I.amOnPage(this.url);
  }

  /**
   * Click join now button.
   * @return { void }
   */
  public clickJoinNow() {
    I.click(this.selectButtonSelector);
  }

  /**
   * Fill registration form.
   * @param { string } username - username to use.
   * @param { string } password - password to use.
   * @param { string } email - email to use.
   * @return { void }
   */
  public fillForm(username: string, password: string, email: string): void {
    helpers.setCaptchaBypassCookie();
    helpers.setRateLimitBypassCookie();

    this.inputUsername(username);
    this.inputEmail(email);
    this.inputPassword(password);
    this.inputPasswordConfirmation(password);
    this.clickAcceptTerms();
  }

  /**
   * Input username.
   * @param { string } username - username to use.
   * @return { void }
   */
  private inputUsername(username: string): void {
    I.fillField(this.usernameSelector, username);
  }

  /**
   * Input email.
   * @param { string } email - email to use.
   * @return { void }
   */
  private inputEmail(email: string): void {
    I.fillField(this.emailSelector, email);
  }

  /**
   * Input password.
   * @param { string } password - password to use.
   * @return { void }
   */
  private inputPassword(password: string): void {
    I.fillField(this.passwordSelector, password);
  }

  /**
   * Input password confirmation.
   * @param { string } password - password to use.
   * @return { void }
   */
  private inputPasswordConfirmation(password: string): void {
    I.fillField(this.password2Selector, password);
  }

  /**
   * Click accept terms.
   * @return { void }
   */
  private clickAcceptTerms(): void {
    I.click(this.acceptTosSelector);
  }
}

export = RegisterPage;

import { Environment } from '../types/devtools.types';
import assert from 'assert';

require('dotenv').config();
const { I } = inject();

/**
 * Devtools page (/devtools) containing environment selector.
 */
class DevtoolsPage {
  /** @type { string }  - uri of the page */
  public uri: string = '/devtools';

  /** @type { string } - baseUrl from env */
  private baseUrl: string = process.env.E2E_DOMAIN ?? 'https://www.minds.com';

  /**
   * Navigate to the devtools page.
   * @returns { void }
   */
  public navigateTo(): void {
    I.amOnPage(this.uri);
  }

  /**
   * Check page has no canary env option.
   * @returns { void }
   */
  public hasNoCanaryOption(): void {
    I.dontSeeElement(this.getRadioButtonSelector('canary'));
  }

  /**
   * Click and select a radio button.
   * @param { Environment } environment - environment to select.
   * @returns { void }
   */
  public selectRadioButton(environment: Environment): void {
    I.click(this.getRadioButtonSelector(environment));
  }

  /**
   * Submit change of env.
   * @param { boolean } loggedIn - whether logged in or not.
   */
  public submitChange(loggedIn: boolean = true): void {
    I.click(locate('button').withText('Switch'));

    if (loggedIn) {
      I.waitForResponse(this.baseUrl + 'api/v2/canary', 10);
      I.refreshPage(); // force refresh to prevent race condition.
    }
  }

  /**
   * Checks current environment.
   * @param { Environment } environment - environment to check matches current environment.
   * @returns { Promise<void> }
   */
  public async checkEnvironment(environment: Environment): Promise<void> {
    if (environment === 'production') {
      this.productionCheck();
      return;
    }
    await this.nonProductionCheck(environment);
  }

  /**
   * Verify you are in an environment other than production
   * @param { Environment } environment - environment to check matches current environment.
   * @returns { Promise<void> }
   */
  private async nonProductionCheck(environment: Environment): Promise<void> {
    const env = environment as string;
    I.seeCookie(env);
    const cookie = await I.grabCookie(env);
    assert(cookie.value, '1');
    I.seeElement(
      locate(this.getEnvironmentFlagSelector()).withText(
        env.replace(env[0], env[0].toUpperCase())
      )
    );
  }

  /**
   * Verify you are in the production environment.
   * @returns { void }
   */
  private productionCheck(): void {
    I.dontSeeCookie('staging');
    I.dontSeeElement(locate(this.getEnvironmentFlagSelector()));
  }

  /**
   * Get radio button selector by environment name.
   * @param { Environment } environment - environment to get selector for.
   * @returns { string } selector.
   */
  private getRadioButtonSelector(environment: Environment): string {
    return `.m-form__customInputWrapper__radio input[value=${environment}]`;
  }

  /**
   * Get environmental flag selector.
   * @returns { string } environmental flag selector.
   */
  private getEnvironmentFlagSelector(): string {
    return '.m-environmentFlag__flag';
  }
}

export = DevtoolsPage;

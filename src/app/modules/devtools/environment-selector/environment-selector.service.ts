import { Injectable } from '@angular/core';
import { ApiResponse, ApiService } from '../../../common/api/api.service';
import { ConfigsService } from '../../../common/services/configs.service';
import { Session } from '../../../services/session';
import { CookieService } from '../../../common/services/cookie.service';

// Different environments.
export type Environment = 'production' | 'canary' | 'staging';

/**
 * Detect what environment a user is in and switch environments.
 */
@Injectable({ providedIn: 'root' })
export class EnvironmentSelectorService {
  constructor(
    private cookies: CookieService,
    private session: Session,
    private api: ApiService,
    private configs: ConfigsService
  ) {}

  /**
   * Whether current environment is staging.
   * @returns { boolean } - true if current environment is staging
   */
  public isStagingEnabled(): boolean {
    return this.getCurrentEnvironment() === 'staging';
  }

  /**
   * Whether current environment is Canary.
   * @returns { boolean } - true if current environment is canary.
   */
  public isCanaryEnabled(): boolean {
    return this.getCurrentEnvironment() === 'canary';
  }

  /**
   * Get current environment from config. In the event it is a development
   * environment, returns the environment you would be in, if not a development one.
   * @returns { Environment } - current environment.
   */
  public getCurrentEnvironment(): Environment {
    const environment = this.configs.get('environment');

    if (this.isDevelopmentEnvironment(environment)) {
      if (this.cookies.get('staging') === '1') {
        return 'staging';
      } else if (
        this.session.getLoggedInUser()?.canary ||
        this.cookies.get('canary') === '1'
      ) {
        return 'canary';
      } else {
        return 'production';
      }
    }

    return environment;
  }

  /**
   * Switch to an environment.
   * @param { Environment } environment - environment to switch to.
   * @returns { Promise<void> }
   */
  public async switchToEnvironment(environment: Environment): Promise<void> {
    // reset state.
    if (this.isCanaryEnabled()) {
      await this.disableCanary();
    }

    this.removeStagingCookie();

    // act to change environments.
    switch (environment) {
      case 'production':
        break;
      case 'canary':
        await this.enableCanary();
        break;
      case 'staging':
        this.addStagingCookie();
        break;
    }

    // reload so changes take effect.
    this.reloadPage();
  }

  /**
   * Reloads page.
   * @returns { void }
   */
  private reloadPage(): void {
    window.location.reload();
  }

  /**
   * Enable Canary if user is logged in.
   * @returns { Promise<ApiResponse|void> } - api request, or void if user not logged in.
   */
  private async enableCanary(): Promise<ApiResponse | void> {
    if (this.session.isLoggedIn()) {
      await this.api.put('api/v2/canary').toPromise();
      return;
    }
    this.cookies.set('canary', '1', { path: '/' });
  }

  /**
   * Disable Canary - CAN be called from a logged out state to get rid of any lingering cookie.
   * @returns { Promise<void> }
   */
  private async disableCanary(): Promise<void> {
    if (this.session.isLoggedIn()) {
      await this.api.delete('api/v2/canary').toPromise();
      return;
    }
    this.cookies.set('canary', '0', { path: '/' });
  }

  /**
   * Add staging cookie.
   * @returns { void }
   */
  private addStagingCookie(): void {
    this.cookies.set('staging', '1', { path: '/' });
  }

  /**
   * Removes staging cookie.
   * @returns { void }
   */
  private removeStagingCookie(): void {
    this.cookies.delete('staging');
  }

  /**
   * Returns whether the env is a development environment.
   * @param { string } environment - environment to check.
   * @returns { boolean } true if environment is a development environment.
   */
  private isDevelopmentEnvironment(environment: string): boolean {
    return ['production', 'canary', 'staging'].indexOf(environment) === -1;
  }
}

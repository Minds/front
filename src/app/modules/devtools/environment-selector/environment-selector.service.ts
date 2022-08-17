import { Injectable } from '@angular/core';
import { CookieService } from '@mindsorg/ngx-universal';
import { ApiResponse, ApiService } from '../../../common/api/api.service';
import { ConfigsService } from '../../../common/services/configs.service';
import { Session } from '../../../services/session';

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
   * Whether Canary option should be shown.
   * @returns { boolean } true if canary option should be shown
   */
  public shouldShowCanaryOption(): boolean {
    return this.session.isLoggedIn();
  }

  /**
   * Whether current environment is staging.
   * @returns { boolean } - true if current environment is staging
   */
  public isStagingEnabled(): boolean {
    return this.getCurrentEnvironment() === 'staging';
  }

  /**
   * Whether current environment is Canary or user object is set to be in Canary.
   * @returns { boolean } - true if current environment is canary or user object is set to be in canary.
   */
  public async isCanaryEnabled(): Promise<boolean> {
    // get from server if user is logged in.
    if (this.session.isLoggedIn()) {
      const response = await this.api.get('api/v2/canary').toPromise();
      return response.enabled;
    }
    // else just check env.
    return this.getCurrentEnvironment() === 'canary';
  }

  /**
   * Get current environment from config.
   * @returns { Environment } - current environment.
   */
  public getCurrentEnvironment(): Environment {
    return this.configs.get('environment') ?? 'production';
  }

  /**
   * Switch to an environment.
   * @param { Environment } environment - environment to switch to.
   * @returns { Promise<void> }
   */
  public async switchToEnvironment(environment: Environment): Promise<void> {
    // reset state.
    if (await this.isCanaryEnabled()) {
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
    // window.location.reload();
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
      return this.api.put('api/v2/canary').toPromise();
    }
  }

  /**
   * Disable Canary - CAN be called from a logged out state to get rid of any lingering cookie.
   * @returns { Promise<void> }
   */
  private async disableCanary(): Promise<void> {
    if (this.session.isLoggedIn()) {
      await this.api.delete('api/v2/canary').toPromise();
    }
    this.cookies.put('canary', '0', { path: '/' });
  }

  /**
   * Add staging cookie.
   * @returns { void }
   */
  private addStagingCookie(): void {
    this.cookies.put('staging', '1', { path: '/' });
  }

  /**
   * Removes staging cookie.
   * @returns { void }
   */
  private removeStagingCookie(): void {
    this.cookies.remove('staging');
  }
}

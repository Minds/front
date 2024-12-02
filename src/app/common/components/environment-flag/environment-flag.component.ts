import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Session } from '../../../services/session';

export type EnvironmentFlag = 'Canary' | 'Staging' | '';

/**
 * Small environment flag to be shown to a user alongside a logo to show they are
 * in an environment other than production.
 */
@Component({
  selector: 'm-environmentFlag',
  template: `
    <span
      class="m-environmentFlag__flag"
      *ngIf="getActiveFlag() as activeFlag"
      >{{ activeFlag }}</span
    >
  `,
  styleUrls: ['./environment-flag.component.ng.scss'],
})
export class EnvironmentFlagComponent {
  constructor(
    private session: Session,
    private cookies: CookieService
  ) {}

  /**
   * Gets currently active flag.
   * @returns { EnvironmentFlag }
   */
  public getActiveFlag(): EnvironmentFlag {
    return this.isStagingMode()
      ? 'Staging'
      : this.isCanaryMode()
        ? 'Canary'
        : '';
  }

  /**
   * Whether canary mode is active.
   * @returns { boolean } true if canary mode is active.
   */
  private isCanaryMode(): boolean {
    return (
      this.session.getLoggedInUser()?.canary ||
      this.cookies.get('canary') === '1'
    );
  }

  /**
   * Whether staging mode is active.
   * @returns { boolean } true if staging mode is active.
   */
  private isStagingMode(): boolean {
    return this.cookies.get('staging') === '1';
  }
}

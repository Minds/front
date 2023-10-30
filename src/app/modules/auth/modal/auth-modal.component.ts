import { Component, Inject, OnInit } from '@angular/core';
import { MindsUser } from '../../../interfaces/entities';
import { SiteService } from '../../../common/services/site.service';
import { IS_TENANT_NETWORK } from '../../../common/injection-tokens/tenant-injection-tokens';
import { CDN_ASSETS_URL } from '../../../common/injection-tokens/url-injection-tokens';
import { SITE_NAME } from '../../../common/injection-tokens/common-injection-tokens';

/**
 * Auth modal that can display either login or register form
 */
@Component({
  selector: 'm-auth__modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.ng.scss'],
})
export class AuthModalComponent implements OnInit {
  formDisplay: 'register' | 'login' = 'register';

  /**
   * Gets title for modal.
   * @returns { string } title for modal.
   */
  get title(): string {
    if (this.formDisplay == 'register') {
      return this.isTenantNetwork ? `Join ${this.siteName}` : 'Join Minds';
    }
    return 'Login';
  }

  /**
   * Completion intent
   */
  onComplete: (any) => any = () => {};

  /**
   * Dismiss intent
   */
  onDismissIntent: () => void = () => {};

  constructor(
    public siteService: SiteService,
    @Inject(CDN_ASSETS_URL) private readonly cdnAssetsUrl: boolean,
    @Inject(SITE_NAME) private readonly siteName: boolean,
    @Inject(IS_TENANT_NETWORK) private readonly isTenantNetwork: boolean
  ) {}

  ngOnInit(): void {}

  /**
   * Called when register form is completed
   * @param user
   */
  onRegisterDone(user: MindsUser): void {
    this.onComplete(user);
  }

  /**
   * Called when login form is completed
   * @param user
   */
  onLoginDone(user: MindsUser): void {
    this.onComplete(user);
  }

  /**
   * Shows the login form
   * @param e
   */
  showLoginForm(e: MouseEvent): void {
    this.formDisplay = 'login';
  }

  /**
   * Shows the register form
   * @param e
   */
  showRegisterForm(e: MouseEvent): void {
    this.formDisplay = 'register';
  }

  /**
   * Modal options
   *
   * @param onComplete
   * @param onDismissIntent
   * @param defaults
   */
  setModalData({ formDisplay, onComplete, onDismissIntent }) {
    this.formDisplay = formDisplay;
    this.onComplete = onComplete || (() => {});
    this.onDismissIntent = onDismissIntent || (() => {});
  }

  /**
   * Gets logo src depending on whether we're on a multi-tenant network.
   * @returns { string } - logo src.
   */
  public getLogoSrc(): string {
    return !this.isTenantNetwork
      ? `${this.cdnAssetsUrl}assets/logos/bulb.svg`
      : '/api/v3/multi-tenant/configs/image/square_logo';
  }
}

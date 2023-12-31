import { Component, Inject, OnInit } from '@angular/core';
import { MindsUser } from '../../../interfaces/entities';
import { SiteService } from '../../../common/services/site.service';
import { IS_TENANT_NETWORK } from '../../../common/injection-tokens/tenant-injection-tokens';
import { CDN_ASSETS_URL } from '../../../common/injection-tokens/url-injection-tokens';
import { MultiTenantConfigImageService } from '../../multi-tenant-network/services/config-image.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthModalImageService } from './auth-modal-image.service';
import { CarouselItem } from '../../../common/components/feature-carousel/feature-carousel.component';

export type AuthForm = 'register' | 'login' | 'oidcUsername';

/**
 * Details for identifying an oidc user
 * ojm maybe just do sub string bc id is in cookie
 */
export type OidcUser = {
  providerId: number;
  sub: string;
};

export type AuthModalData = {
  formDisplay?: AuthForm;
  standalonePage?: boolean;
  onLoggedIn?: () => any;
  onRegistered?: () => any;
  onComplete?: (any) => any;
  onDismissIntent?: () => any;
};
/**
 * Auth modal that can display either login or register form
 */
@Component({
  selector: 'm-auth__modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: [
    './auth-modal.component.ng.scss',
    '../../../../stylesheets/two-column-layout.ng.scss',
    '../auth.module.ng.scss',
  ],
})
export class AuthModalComponent implements OnInit {
  formDisplay: AuthForm = 'register';

  /**
   * True if the auth modal was opened from the /login or /register page
   */
  standalonePage: boolean = false;

  /**
   * Identifying details of an oidc user that needs
   * to create a username
   */
  oidcUser: OidcUser;

  /**
   * Called when user logs in
   */
  onLoggedIn: () => void = () => {};

  /**
   * Called when user registers
   */
  onRegistered: () => void = () => {};

  /**
   * Completion intent
   */
  onComplete: (any) => any = () => {};

  /**
   * Dismiss intent
   */
  onDismissIntent: () => void = () => {};

  /** Carousel items to be displayed on minds.com */
  public readonly carouselItems$: Observable<CarouselItem[]> = this
    .authModalImageService.carouselItems$;

  /** Tenant logo path for display instead of the carousel on tenant networks. */
  public readonly tenantLogoPath$: Observable<string> = this
    .tenantConfigImageService.horizontalLogoPath$;

  constructor(
    public siteService: SiteService,
    @Inject(CDN_ASSETS_URL) private readonly cdnAssetsUrl: boolean,
    @Inject(IS_TENANT_NETWORK) protected readonly isTenantNetwork: boolean,
    protected site: SiteService,
    private tenantConfigImageService: MultiTenantConfigImageService,
    private router: Router,
    protected authModalImageService: AuthModalImageService
  ) {}

  ngOnInit(): void {
    if (!this.isTenantNetwork) {
      this.authModalImageService.loadImages();
    }
  }

  /**
   * Called when register form is completed
   * @param user
   */
  onRegisterDone(user: MindsUser): void {
    this.onRegistered();
    this.onComplete(user);
  }

  /**
   * Called when login form is completed
   * @param user
   */
  onLoginDone(user: MindsUser): void {
    this.onLoggedIn();
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
   * Shows the oidc username form
   * @param e
   */
  showOidcUsernameForm(oidcUser: OidcUser): void {
    if (!oidcUser) {
      return;
    }
    this.oidcUser = oidcUser;
    this.formDisplay = 'oidcUsername';
  }

  /**
   * Modal options
   * @param {AuthModalData} data
   */
  setModalData({
    formDisplay,
    standalonePage,
    onLoggedIn,
    onRegistered,
    onComplete,
    onDismissIntent,
  }: AuthModalData) {
    this.formDisplay = formDisplay;
    this.formDisplay = 'oidcUsername';

    this.standalonePage = standalonePage;
    this.onLoggedIn = onLoggedIn || (() => {});
    this.onRegistered = onRegistered || (() => {});
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

  clickedBackButton(): void {
    if (this.standalonePage) {
      this.router.navigate(['/']);
    }
    this.onDismissIntent();
  }
}

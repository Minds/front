import { Component, Inject, OnInit } from '@angular/core';
import { MetaService } from '../../common/services/meta.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ResetPasswordModalService } from '../auth/reset-password-modal/reset-password-modal.service';
import { SiteService } from '../../common/services/site.service';
import { IsTenantService } from '../../common/services/is-tenant.service';
import { Session } from '../../services/session';
import { ConfigsService } from '../../common/services/configs.service';
import { IS_TENANT_NETWORK } from '../../common/injection-tokens/tenant-injection-tokens';
import { AuthRedirectService } from '../../common/services/auth-redirect.service';
import { AuthModalService } from '../auth/modal/auth-modal.service';

/**
 * Routes users to a "homepage" depending on active experiments.
 */
@Component({
  selector: 'm-homepageContainer',
  templateUrl: 'homepage-container.component.html',
  styleUrls: ['homepage-container.component.ng.scss'],
})
export class HomepageContainerComponent implements OnInit {
  /** Whether the custom tenant homepage variant should be shown. */
  protected isTenantCustomHomepage: boolean = false;

  constructor(
    private metaService: MetaService,
    private route: ActivatedRoute,
    private router: Router,
    private resetPasswordModal: ResetPasswordModalService,
    private authRedirectService: AuthRedirectService,
    private authModal: AuthModalService,
    private site: SiteService,
    private isTenant: IsTenantService,
    private session: Session,
    private config: ConfigsService,
    @Inject(IS_TENANT_NETWORK) protected readonly isTenantNetwork: boolean
  ) {}

  queryParams;

  ngOnInit(): void {
    if (this.session.isLoggedIn()) {
      if (this.route.snapshot.fragment === 'boost') {
        this.router.navigate(
          [this.authRedirectService.getDefaultRedirectUrl()],
          {
            queryParams: { createBoost: 1 },
          }
        );
      } else {
        if (this.isTenantNetwork) {
          this.authRedirectService.redirect();
        } else {
          this.router.navigate(['/newsfeed']);
        }
      }
    }

    if (
      this.isTenantNetwork &&
      this.config.get('tenant')['custom_home_page_enabled']
    ) {
      this.isTenantCustomHomepage = true;
    } else if (
      !this.session.isLoggedIn() &&
      this.isTenantNetwork &&
      this.config.get('tenant')['walled_garden_enabled']
    ) {
      this.authModal
        .open({ formDisplay: 'login' })
        .then(() => this.authRedirectService.redirect());
    }

    this.route.queryParams.subscribe((params) => {
      // open reset password modal
      if (params['resetPassword']) {
        this.queryParams = params;
        this.openResetPasswordModal();
      }
    });

    this.router.events.subscribe((navEvent) => {
      if (navEvent instanceof NavigationEnd) {
        // Keep track of router events here
        // in case we click 'forgot password' from the auth modal
        // while we're already on the homepage (aka queryParams
        // subscription above doesn't fire)
        if (this.route.snapshot.queryParamMap.has('resetPassword')) {
          if (navEvent.url.includes('resetPassword')) {
            this.openResetPasswordModal();
          }
        }
      }
    });

    const siteName = this.site.title;
    const siteDescription = !this.isTenant.is()
      ? 'Elevate the global conversation through Internet freedom. Speak freely, protect your privacy, earn crypto, and take back control of your social media'
      : this.config.get('tenant')?.['custom_home_page_description'] ??
        ' A social app.';

    this.metaService
      .setTitle(siteName, false)
      .setDescription(siteDescription)
      .setCanonicalUrl('/')
      .setOgUrl('/');
  }

  /**
   * Opens the reset password modal
   */
  openResetPasswordModal(): void {
    let opts = {};

    if (this.queryParams['username'] && this.queryParams['code']) {
      opts['username'] = this.queryParams['username'];
      opts['code'] = this.queryParams['code'];
    }

    this.resetPasswordModal.open(opts);
  }
}

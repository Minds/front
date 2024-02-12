import { Component, OnInit } from '@angular/core';
import { MetaService } from '../../common/services/meta.service';
import { GuestModeExperimentService } from '../experiments/sub-services/guest-mode-experiment.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ResetPasswordModalService } from '../auth/reset-password-modal/reset-password-modal.service';
import { SiteService } from '../../common/services/site.service';
import { IsTenantService } from '../../common/services/is-tenant.service';
import { Session } from '../../services/session';

/**
 * Routes users to a "homepage" depending on active experiments.
 */
@Component({
  selector: 'm-homepageContainer',
  templateUrl: 'container.component.html',
  styleUrls: ['container.component.ng.scss'],
})
export class HomepageContainerComponent implements OnInit {
  constructor(
    private metaService: MetaService,
    private guestModeExperiment: GuestModeExperimentService,
    private route: ActivatedRoute,
    private router: Router,
    private resetPasswordModal: ResetPasswordModalService,
    private site: SiteService,
    private isTenant: IsTenantService,
    private session: Session
  ) {}

  isGuestMode: boolean;

  queryParams;

  ngOnInit(): void {
    if (this.session.isLoggedIn()) {
      this.router.navigate(['/newsfeed']);
      return;
    }

    this.route.queryParams.subscribe(params => {
      // open reset password modal
      if (params['resetPassword']) {
        this.queryParams = params;
        this.openResetPasswordModal();
      }
    });

    this.router.events.subscribe(navEvent => {
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
      : ' A social app.';

    this.metaService
      .setTitle(siteName, false)
      .setDescription(siteDescription)
      .setCanonicalUrl('/')
      .setOgUrl('/');

    this.isGuestMode = this.guestModeExperiment.isActive();
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

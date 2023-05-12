import { Component, OnInit } from '@angular/core';
import { MetaService } from '../../common/services/meta.service';
import { GuestModeExperimentService } from '../experiments/sub-services/guest-mode-experiment.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ResetPasswordModalService } from '../auth/reset-password-modal/reset-password-modal.service';

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
    private resetPasswordModal: ResetPasswordModalService
  ) {}

  isGuestMode: boolean;

  queryParams;

  ngOnInit(): void {
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

    this.metaService
      .setTitle(`Minds`, false)
      .setDescription(
        'Elevate the global conversation through Internet freedom. Speak freely, protect your privacy, earn crypto, and take back control of your social media'
      )
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

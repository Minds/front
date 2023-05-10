import { Component, OnInit } from '@angular/core';
import { MetaService } from '../../common/services/meta.service';
import { GuestModeExperimentService } from '../experiments/sub-services/guest-mode-experiment.service';
import { ActivatedRoute } from '@angular/router';
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
    private resetPasswordModal: ResetPasswordModalService
  ) {}

  isGuestMode: boolean;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      // open reset password modal
      if (params['resetPassword']) {
        let opts = {};

        if (params['username'] && params['code']) {
          opts['username'] = params.get('username');
          opts['code'] = params.get('code');
        }

        this.resetPasswordModal.open(opts);
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
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Session } from '../../../../services/session';
import { AffiliatesExperimentService } from '../../../experiments/sub-services/affiliates-experiment.service';

/**
 * Settings page for referrals links and a dashboard that contains a list of referrals associated with your channel
 */
@Component({
  selector: 'm-settingsV2__referrals',
  templateUrl: 'referrals.component.html',
})
export class SettingsV2ReferralsComponent implements OnInit {
  constructor(
    public session: Session,
    public route: ActivatedRoute,
    public router: Router,
    private affiliatesExperiment: AffiliatesExperimentService
  ) {}
  ngOnInit() {
    if (!this.session.isLoggedIn()) {
      return this.router.navigate(['/login']);
    }

    if (this.affiliatesExperiment.isActive()) {
      this.router.navigate(['/settings/affiliates-program']);
    }
  }
}

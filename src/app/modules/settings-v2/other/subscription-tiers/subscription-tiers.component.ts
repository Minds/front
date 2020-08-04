import { Component, EventEmitter, OnInit } from '@angular/core';

import { Session } from '../../../../services/session';
import { Client } from '../../../../services/api';
import { Router } from '@angular/router';
import { FeaturesService } from '../../../../services/features.service';

@Component({
  selector: 'm-settingsV2__subscriptionTiers',
  templateUrl: './subscription-tiers.component.html',
})
export class SettingsV2SubscriptionTiersComponent implements OnInit {
  isSaving = false;
  isSaved = false;
  triggerSave = new EventEmitter(true);
  error: string;

  constructor(
    public session: Session,
    public client: Client,
    private router: Router,
    private features: FeaturesService
  ) {}

  ngOnInit() {
    if (this.features.has('paywall-2020')) {
      // Reroute to the user's shop page
      const username = this.session.getLoggedInUser().username;
      this.router.navigate([`/${username}/shop`], { skipLocationChange: true });
    }
  }

  save() {
    this.triggerSave.next(true);
  }
}

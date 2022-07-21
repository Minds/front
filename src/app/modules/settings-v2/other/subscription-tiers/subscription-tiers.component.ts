import { Component, EventEmitter, OnInit } from '@angular/core';

import { Session } from '../../../../services/session';
import { Client } from '../../../../services/api';
import { Router } from '@angular/router';

/**
 * Settings component that reroutes to the user's
 * channel membership tiers
 */
@Component({
  selector: 'm-settingsV2__subscriptionTiers',
  template: ``,
})
export class SettingsV2SubscriptionTiersComponent implements OnInit {
  isSaving = false;
  isSaved = false;
  triggerSave = new EventEmitter(true);
  error: string;

  constructor(
    public session: Session,
    public client: Client,
    private router: Router
  ) {}

  ngOnInit() {
    // Reroute to the user's shop page
    const username = this.session.getLoggedInUser().username;
    this.router.navigate([`/${username}/shop`], { skipLocationChange: true });
  }
}

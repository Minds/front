import { Component, EventEmitter } from '@angular/core';

import { Session } from '../../../../services/session';
import { Client } from '../../../../services/api';

@Component({
  selector: 'm-settingsV2__subscriptionTiers',
  templateUrl: './subscription-tiers.component.html',
})
export class SettingsV2SubscriptionTiersComponent {
  isSaving = false;
  isSaved = false;
  triggerSave = new EventEmitter(true);
  error: string;

  constructor(public session: Session, public client: Client) {}

  save() {
    this.triggerSave.next(true);
  }
}

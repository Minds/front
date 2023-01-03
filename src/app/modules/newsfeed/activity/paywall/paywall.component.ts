import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';

import {
  ActivityService,
  ActivityEntity,
} from '../../activity/activity.service';

/**
 * Blocks the activity post content until the user has permission to view.
 * It's just a wrapper around 'm-wire--lock-screen'.
 */
@Component({
  selector: 'm-activity__paywall',
  templateUrl: './paywall.component.html',
  styleUrls: ['./paywall.component.ng.scss'],
})
export class ActivityPaywallComponent {
  @Input() mediaHeight: number | null = null;
  @Input() hideText: boolean = false;

  constructor(public service: ActivityService) {}

  onEntityUpdated(entity: ActivityEntity): void {
    this.service.setEntity(entity);
    if (entity.paywall_unlocked) {
      this.service.paywallUnlockedEmitter.next(true);
    }
  }
}

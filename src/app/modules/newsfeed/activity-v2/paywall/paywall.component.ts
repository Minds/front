import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';

import {
  ActivityService,
  ActivityEntity,
} from '../../activity/activity.service';

@Component({
  selector: 'm-activityV2__paywall',
  templateUrl: './paywall.component.html',
  styleUrls: ['./paywall.component.ng.scss'],
})
export class ActivityV2PaywallComponent {
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

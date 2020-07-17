import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';

import { ActivityService, ActivityEntity } from '../activity.service';

@Component({
  selector: 'm-activity__paywall',
  templateUrl: './paywall.component.html',
})
export class ActivityPaywallComponent {
  @Input() mediaHeight: number | null = null;

  constructor(public service: ActivityService) {}

  onEntityUpdated(entity: ActivityEntity): void {
    this.service.setEntity(entity);
    if (entity.paywall_unlocked) {
      this.service.paywallUnlockedEmitter.next(true);
    }
  }
}

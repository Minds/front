import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import {
  ActivityEntity,
  ActivityService,
} from '../../activity/activity.service';

/**
 * Flags are optionally displayed at the top of an activity post, where applicable.
 * There can be either a 'reminded by' flag or a 'boosted post' flag, but never both.
 */
@Component({
  selector: 'm-activityV2__flag',
  templateUrl: './flag.component.html',
  styleUrls: ['./flag.component.ng.scss'],
})
export class ActivityV2FlagComponent {
  entity$: Observable<ActivityEntity> = this.service.entity$;
  subscriptions: Subscription[];

  constructor(public service: ActivityService) {}

  get minimalMode(): boolean {
    return this.service.displayOptions.minimalMode;
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import {
  ActivityEntity,
  ActivityService,
} from '../../activity/activity.service';

@Component({
  selector: 'm-activityV2__flags',
  templateUrl: './flags.component.html',
  styleUrls: ['./flags.component.ng.scss'],
})
export class ActivityV2FlagsComponent {
  entity$: Observable<ActivityEntity> = this.service.entity$;
  subscriptions: Subscription[];

  isBoost;
  isRemind: boolean = false;

  constructor(public service: ActivityService) {}

  get minimalMode(): boolean {
    return this.service.displayOptions.minimalMode;
  }
}

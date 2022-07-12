import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Session } from '../../../../services/session';
import {
  ActivityEntity,
  ActivityService,
} from '../../activity/activity.service';

/**
 * Displays badges of activity post owner (if applicable).
 * See it in the activity owner block component.
 */
@Component({
  selector: 'm-activityV2__badges',
  templateUrl: './badges.component.html',
  styleUrls: ['./badges.component.ng.scss'],
})
export class ActivityV2BadgesComponent {
  entity$: Observable<ActivityEntity> = this.service.entity$;

  constructor(public service: ActivityService, public session: Session) {}

  get minimalMode(): boolean {
    return this.service.displayOptions.minimalMode;
  }
}

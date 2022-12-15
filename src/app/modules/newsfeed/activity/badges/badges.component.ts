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
  selector: 'm-activity__badges',
  templateUrl: './badges.component.html',
  styleUrls: ['./badges.component.ng.scss'],
})
export class ActivityBadgesComponent {
  entity$: Observable<ActivityEntity> = this.service.entity$;

  constructor(public service: ActivityService, public session: Session) {}

  get minimalMode(): boolean {
    return this.service.displayOptions.minimalMode;
  }
}

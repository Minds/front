import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  ActivityEntity,
  ActivityService,
} from '../../activity/activity.service';
import { Session } from '../../../../services/session';

/**
 * View count of the activity post. Displayed to owners only.
 */
@Component({
  selector: 'm-activityV2__views',
  templateUrl: './views.component.html',
  styleUrls: ['./views.component.scss'],
})
export class ActivityV2ViewsComponent implements OnInit {
  private entitySubscription: Subscription;

  entity: ActivityEntity;

  showViews: boolean = false;
  views: number;

  constructor(public service: ActivityService, public session: Session) {}

  /**
   * Views should be visible to admins and post owners only
   * In modal and minimal mode, they are inline next to the permalink
   * In the feed, they are on the right side of the owner block
   */
  ngOnInit(): void {
    this.entitySubscription = this.service.entity$.subscribe(
      (entity: ActivityEntity) => {
        this.entity = entity;

        this.showViews =
          this.session.isAdmin() ||
          entity.ownerObj.guid === this.session.getLoggedInUser().guid;

        if (this.showViews) {
          this.views = entity.impressions;
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.entitySubscription.unsubscribe();
  }
}

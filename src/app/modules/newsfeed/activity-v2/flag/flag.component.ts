import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AbstractSubscriberComponent } from '../../../../common/components/abstract-subscriber/abstract-subscriber.component';
import {
  ActivityEntity,
  ActivityService,
} from '../../activity/activity.service';

/**
 * Flags are displayed at the top of an activity post, where applicable
 * (aka if the post is boosted, reminded, or a supermind request).
 * Only one is displayed at a time.
 * Flags are not displayed in minimal mode.
 */
export type ActivityFlagType = 'boost' | 'remind' | 'supermindRequest';
@Component({
  selector: 'm-activityV2__flag',
  templateUrl: './flag.component.html',
  styleUrls: ['./flag.component.ng.scss'],
})
export class ActivityV2FlagComponent extends AbstractSubscriberComponent
  implements OnInit {
  entity$: Observable<ActivityEntity> = this.service.entity$;
  entity;

  subscriptions: Subscription[] = [];

  activeFlag: ActivityFlagType;

  constructor(public service: ActivityService) {
    super();
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.service.entity$.subscribe(entity => {
        this.entity = entity;
        this.setActiveFlag();
      })
    );
  }

  /**
   * Determine which flag will be displayed
   *
   * Supermind request flags are only displayed if boost/remind flags are
   * not applicable.
   * */
  setActiveFlag(): void {
    if (!this.entity) {
      return;
    }

    // Boost
    if (this.entity.boosted) {
      this.activeFlag = 'boost';
      return;
    }

    // Remind
    if (this.entity.remind_users && this.entity.remind_users.length) {
      this.activeFlag = 'remind';
      return;
    }

    // Supermind request
    if (
      this.entity.supermind &&
      !this.entity.supermind.is_reply &&
      this.entity.supermind.receiver_user
    ) {
      this.activeFlag = 'supermindRequest';
      return;
    }
  }

  get minimalMode(): boolean {
    return this.service.displayOptions.minimalMode;
  }
}

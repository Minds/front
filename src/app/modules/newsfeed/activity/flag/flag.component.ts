import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AbstractSubscriberComponent } from '../../../../common/components/abstract-subscriber/abstract-subscriber.component';
import { Session } from '../../../../services/session';
import { PaywallContextExperimentService } from '../../../experiments/sub-services/paywall-context-experiment.service';
import {
  ActivityEntity,
  ActivityService,
} from '../../activity/activity.service';

/**
 * A flag is displayed at the top of an activity post, if applicable
 * (a.k.a. reminds, boosts, supermind requests, paywalled posts)
 *
 * Only one is displayed at a time.
 * Flags are not displayed in minimal mode.
 */
export type ActivityFlagType =
  | 'boost'
  | 'remind'
  | 'supermindRequest'
  | 'mutualSubscriptions';

@Component({
  selector: 'm-activity__flag',
  templateUrl: './flag.component.html',
  styleUrls: ['./flag.component.ng.scss'],
})
export class ActivityFlagComponent extends AbstractSubscriberComponent
  implements OnInit {
  entity$: Observable<ActivityEntity> = this.service.entity$;
  entity;

  subscriptions: Subscription[] = [];

  activeFlag: ActivityFlagType;

  isSupermindRequest: boolean;

  constructor(
    public service: ActivityService,
    public session: Session,
    private paywallContextExperiment: PaywallContextExperimentService
  ) {
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

    // Mutual subscriptions (for paywalled posts)
    // if (
    //   this.paywallContextExperiment.isActive() &&
    //   !!this.entity.paywall &&
    //   this.entity.ownerObj.guid !== this.session.getLoggedInUser().guid
    // ) {
    //   this.activeFlag = 'mutualSubscriptions';
    //   return;
    // }
  }

  get minimalMode(): boolean {
    return this.service.displayOptions.minimalMode;
  }
}

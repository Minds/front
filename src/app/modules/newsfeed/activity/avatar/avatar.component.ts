import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  ActivityDisplayOptions,
  ActivityEntity,
  ActivityService,
} from '../activity.service';
import { Session } from '../../../../services/session';
import { ConfigsService } from '../../../../common/services/configs.service';

/**
 * Displays the avatar for the activity
 * (or avatars - both group and post owner - if it's a group post
 * displayed outside of the group's profile feed
 *
 * Currently does NOT cover avatars in modals or sidebar/minimal modes.
 * Those are handled in m-activity__ownerBlock
 * ojm TODO do this now?
 */
@Component({
  selector: 'm-activity__avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.ng.scss'],
})
export class ActivityAvatarComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  @Input() entity: ActivityEntity;
  @Input() displayOptions: ActivityDisplayOptions;

  userAvatarUrl: string;

  showGroupContext: boolean = false;

  groupAvatarUrl: string;
  groupUrl: string;

  constructor(
    private service: ActivityService,
    private session: Session,
    private configs: ConfigsService
  ) {}

  ngOnInit(): void {
    if (!this.entity || !this.displayOptions) {
      return;
    }

    this.subscriptions.push(
      this.service.showGroupContext$.subscribe((should: boolean) => {
        this.showGroupContext = should;

        console.log('ojm show group', should);
        if (should) {
          const group = this.entity.containerObj;

          this.groupAvatarUrl = `${this.configs.get('cdn_url')}fs/v1/avatars/${
            group.guid
          }/medium/${group.icontime}`;

          // ojm handle v2 link
          // ojm test this
          this.groupUrl = `groups/profile/${group.guid}`;
        }
      })
    );

    const currentUser = this.session.getLoggedInUser();
    const iconTime: number =
      currentUser && currentUser.guid === this.entity.ownerObj.guid
        ? currentUser.icontime
        : this.entity.ownerObj.icontime;

    this.userAvatarUrl =
      this.configs.get('cdn_url') +
      'icon/' +
      this.entity.ownerObj.guid +
      '/medium/' +
      iconTime;
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}

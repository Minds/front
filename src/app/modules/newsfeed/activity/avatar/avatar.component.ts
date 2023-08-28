import {
  Component,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivityEntity, ActivityService } from '../activity.service';
import { Session } from '../../../../services/session';
import { ConfigsService } from '../../../../common/services/configs.service';
import { ExperimentsService } from '../../../experiments/experiments.service';

/**
 * Displays the avatar for the activity
 * (or avatars - both group and post owner - if it's a group post
 * displayed outside of the group's profile feed
 */
@Component({
  selector: 'm-activity__avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.ng.scss'],
})
export class ActivityAvatarComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  @Input() entity: ActivityEntity;

  /** Is this activity the quoted/reminded post? */
  @Input() wasQuoted: boolean = false;

  /** Is this activity the container of a reminded post? */
  isRemind: boolean = false;
  /**
   * For when we are showing a group post outside of the group's feed
   */
  showGroupContext: boolean = false;

  userAvatarSize: string = 'medium';

  groupAvatarUrl: string;
  groupUrl: string;

  // Note: currently ownerBlocks are only visible in minimalMode for quotes/reminds
  // and sidebar suggestions stemming from group posts
  @HostBinding('class.m-activity__avatar--minimalMode')
  get minimalMode(): boolean {
    return this.service.displayOptions.minimalMode;
  }

  get quoteOrRemind(): boolean {
    return this.wasQuoted || this.isRemind;
  }

  constructor(
    private service: ActivityService,
    private session: Session,
    private configs: ConfigsService,
    private experimentsService: ExperimentsService
  ) {}

  ngOnInit(): void {
    if (!this.entity) {
      return;
    }

    this.subscriptions.push(
      this.service.showGroupContext$.subscribe((show: boolean) => {
        this.showGroupContext =
          show && !this.service.displayOptions.minimalMode;

        // We only show the user avatar in minimal mode
        if (this.showGroupContext) {
          this.userAvatarSize = 'small';

          const group = this.entity.containerObj;

          this.groupAvatarUrl = `${this.configs.get('cdn_url')}fs/v1/avatars/${
            group.guid
          }/medium/${group.icontime}`;

          this.groupUrl = `/group/${group.guid}`;
        }
      }),
      this.service.isRemind$.subscribe((is: boolean) => {
        this.isRemind = is;
      })
    );
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  get iconTime(): number {
    const currentUser = this.session.getLoggedInUser();
    return currentUser && currentUser.guid === this.entity.ownerObj.guid
      ? currentUser.icontime
      : this.entity.ownerObj.icontime;
  }

  get userAvatarUrl(): string {
    return `${this.configs.get('cdn_url')}icon/${this.entity.ownerObj.guid}/${
      this.userAvatarSize
    }/${this.iconTime}`;
  }
}

import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';

import {
  ActivityService,
  ActivityEntity,
} from '../../activity/activity.service';
import { ConfigsService } from '../../../../common/services/configs.service';
import { Session } from '../../../../services/session';
import { MindsUser, MindsGroup } from '../../../../interfaces/entities';

/**
 * A row dedicated to information about the owner of the post, among other things.
 *
 * Depending on context, it may show username, badges, user handle (not in mobile),
 * avatar (only in modal and minimal/sidebar modes),
 * permalink (not in single activity page or modal), view count (only for owners),
 * the post dropdown menu, etc...
 */
@Component({
  selector: 'm-activity__ownerBlock',
  templateUrl: 'owner-block.component.html',
  styleUrls: ['./owner-block.component.ng.scss'],
})
export class ActivityOwnerBlockComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  isLoggedIn: boolean;

  entity: ActivityEntity;

  /** Is this activity the container of a reminded post? */
  isRemind: boolean = false;

  /**
   * Whether we need to show the group avatar as well as the user avatar,
   * because this is a group post displayed outside of the group's feed
   * and requires additional contextual information displayed
   */
  @HostBinding('class.m-activity__ownerBlock--groupContext')
  showGroupContext: boolean = false;

  /** Is this activity the quoted/reminded post? */
  @Input() wasQuoted: boolean = false;

  @Output() deleted: EventEmitter<any> = new EventEmitter<any>();

  isFeed: boolean;
  isModal: boolean;
  isSidebarBoost: boolean;
  isSingle: boolean;

  owner: MindsUser;
  username: string;
  displayName: string;
  ownerGuid: string;

  primaryName: string;
  primaryUrl: string;
  secondaryName: string;

  /**
   * If the name is in the second row, display channel badges there
   */
  showUsernameInSecondRow: boolean;
  showPermalink: boolean;
  showSpacer: boolean;
  /**
   * Badges refers to icons and labels on the right side of the ownerblock,
   * such as paywall icon, pin icon, "Supermind Offer", etc.
   * (not channel badges)
   */
  showBadges: boolean;
  showViews: boolean;
  showMenu: boolean;

  constructor(
    public service: ActivityService,
    public session: Session,
    private configs: ConfigsService
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.service.entity$.subscribe((entity: ActivityEntity) => {
        this.entity = entity;
      }),
      this.service.isRemind$.subscribe((is: boolean) => {
        this.isRemind = is;
      }),
      this.service.showGroupContext$.subscribe((show: boolean) => {
        this.showGroupContext = show;
      })
    );

    this.isLoggedIn = this.session.getLoggedInUser();

    // Activity details
    this.owner = this.entity.ownerObj;
    this.username = this.owner.username;
    this.displayName = this.owner.name;
    this.ownerGuid = this.owner.guid;

    // Context
    this.isFeed = this.service.displayOptions.isFeed;
    this.isModal = this.service.displayOptions.isModal;
    this.isSidebarBoost = this.service.displayOptions.isSidebarBoost;
    this.isSingle = this.service.displayOptions.isSingle;

    // Display logic
    this.primaryName = this.showGroupContext
      ? this.group.name
      : this.displayName;

    this.primaryUrl = this.showGroupContext
      ? this.groupUrl
      : `/${this.username}`;

    this.secondaryName = this.showGroupContext
      ? this.displayName
      : this.owner.username;

    this.showUsernameInSecondRow =
      this.showGroupContext || (!this.isMinimalMode && !this.isSidebarBoost);

    this.showPermalink = !(
      (this.isSingle && !this.wasQuoted) ||
      this.isModal ||
      this.isMinimalMode
    );

    this.showSpacer = !(this.isMinimalMode || this.isSidebarBoost);

    this.showBadges =
      !this.isQuoteOrRemind &&
      ((this.isFeed && !this.isMinimalMode) ||
        (this.isSingle && !this.wasQuoted) ||
        this.isModal);

    this.showViews =
      this.isFeed && !this.isMinimalMode && !this.isQuoteOrRemind;

    this.showMenu =
      this.isLoggedIn &&
      ((this.isFeed && !this.isMinimalMode) || this.isSingle || this.isModal) &&
      !this.wasQuoted &&
      this.service.displayOptions.showPostMenu;
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  // Note: currently ownerBlocks are only visible in minimalMode for quotes/reminds
  // and sidebar suggestions stemming from group posts
  @HostBinding('class.m-activity__ownerBlock--minimalMode')
  get isMinimalMode(): boolean {
    return this.service.displayOptions.minimalMode;
  }

  @HostBinding('class.m-activity__ownerBlock--quoteOrRemind')
  get isQuoteOrRemind(): boolean {
    return this.wasQuoted || this.isRemind;
  }

  @HostBinding('class.m-activity__ownerBlock--hasAvatar')
  get showAvatar(): boolean {
    return this.isModal || this.isMinimalMode || this.isSidebarBoost;
  }

  /**
   * Only show if user wasn't already a member
   */
  get group(): MindsGroup | null {
    return this.entity.containerObj && this.entity.containerObj.type === 'group'
      ? this.entity.containerObj
      : null;
  }

  /**
   * Only show if user wasn't already subscribed
   */
  get showSubscribeButton(): boolean {
    return (
      !this.showGroupContext &&
      this.session.getLoggedInUser().guid !== this.ownerGuid &&
      !this.owner.subscribed
    );
  }

  get showJoinButton(): boolean {
    return (
      this.showGroupContext &&
      !this.group['is:member'] &&
      this.group['is:banned'] !== false
    );
  }

  get groupUrl(): string {
    const guid = this.entity.containerObj.guid;
    return `/group/${guid}`;
  }

  /**
   * Return the avatar url
   * TODO: Backend should really be doing this?
   * @return string
   */
  get avatarUrl(): string {
    const currentUser = this.session.getLoggedInUser();
    const iconTime: number =
      currentUser && currentUser.guid === this.ownerGuid
        ? currentUser.icontime
        : this.owner.icontime;
    return (
      this.configs.get('cdn_url') +
      'icon/' +
      this.ownerGuid +
      '/medium/' +
      iconTime
    );
  }

  /**
   * Whether we show a second row in the name column
   */
  get showSecondRow(): boolean {
    const show =
      this.showUsernameInSecondRow ||
      this.showPermalink ||
      this.showSubscribeButton ||
      this.showJoinButton;

    return show;
  }
}

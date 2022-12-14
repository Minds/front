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
  private subscriptions: Subscription[];

  entity: ActivityEntity;

  /** Is this activity the container of a reminded post? */
  isRemind: boolean = false;

  /** Is this activity the quoted/reminded post? */
  @Input() wasQuoted: boolean = false;

  @Output() deleted: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    public service: ActivityService,
    public session: Session,
    private configs: ConfigsService
  ) {}

  ngOnInit() {
    this.subscriptions = [
      this.service.entity$.subscribe((entity: ActivityEntity) => {
        this.entity = entity;
      }),
    ];
    this.subscriptions.push(
      this.service.isRemind$.subscribe((is: boolean) => {
        this.isRemind = is;
      })
    );
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  // Note: currently ownerBlocks are only visible in minimalMode for quotes/reminds
  // and sidebar suggestions stemming from group posts
  @HostBinding('class.m-activity__ownerBlock--minimalMode')
  get minimalMode(): boolean {
    return this.service.displayOptions.minimalMode;
  }

  @HostBinding('class.m-activity__ownerBlock--groupPost')
  get group(): MindsGroup | null {
    return this.entity.containerObj && this.entity.containerObj.type === 'group'
      ? this.entity.containerObj
      : null;
  }

  @HostBinding('class.m-activity__ownerBlock--quoteOrRemind')
  get quoteOrRemind(): boolean {
    return this.wasQuoted || this.isRemind;
  }

  get isFeed(): boolean {
    return this.service.displayOptions.isFeed;
  }

  get isMinimalMode(): boolean {
    return this.service.displayOptions.minimalMode;
  }

  get isModal(): boolean {
    return this.service.displayOptions.isModal;
  }

  get isSidebarBoost(): boolean {
    return this.service.displayOptions.isSidebarBoost;
  }

  get isSingle(): boolean {
    return this.service.displayOptions.isSingle;
  }

  get showPostMenu(): boolean {
    return this.service.displayOptions.showPostMenu;
  }

  get owner(): MindsUser {
    return this.entity.ownerObj;
  }

  get username(): string {
    return this.owner.username;
  }

  get displayName(): string {
    return this.owner.name;
  }

  get ownerGuid(): string {
    return this.owner.guid;
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
}

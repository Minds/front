import {
  Component,
  EventEmitter,
  HostBinding,
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

@Component({
  selector: 'm-activityV2__ownerBlock',
  templateUrl: 'owner-block.component.html',
  styleUrls: ['./owner-block.component.ng.scss'],
})
export class ActivityV2OwnerBlockComponent implements OnInit, OnDestroy {
  private entitySubscription: Subscription;

  entity: ActivityEntity;

  @Output() deleted: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    public service: ActivityService,
    public session: Session,
    private configs: ConfigsService
  ) {}

  ngOnInit() {
    this.entitySubscription = this.service.entity$.subscribe(
      (entity: ActivityEntity) => {
        this.entity = entity;
      }
    );
  }

  ngOnDestroy() {
    this.entitySubscription.unsubscribe();
  }

  @HostBinding('class.m-activity__ownerBlock--remind')
  get isRemindClassBinding(): boolean {
    return this.entity && !!this.entity.remind_object;
  }

  // Note: currently ownerBlocks are only visible in minimalMode for reminds/quotes
  @HostBinding('class.m-activity__ownerBlock--minimalMode')
  get minimalMode(): boolean {
    return this.service.displayOptions.minimalMode;
  }

  @HostBinding('class.m-activity__ownerBlock--sidebarBoost')
  get isSidebarBoost(): boolean {
    return this.service.displayOptions.isSidebarBoost;
  }

  @HostBinding('class.m-activityToolbar--modal')
  get isModal(): boolean {
    return this.service.displayOptions.isModal;
  }

  @HostBinding('class.m-activityToolbar--single')
  get isSingle(): boolean {
    return this.service.displayOptions.isSingle;
  }

  get isFeed(): boolean {
    return this.service.displayOptions.isFeed;
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

  get group(): MindsGroup | null {
    return this.entity.containerObj && this.entity.containerObj.type === 'group'
      ? this.entity.containerObj
      : null;
  }
}

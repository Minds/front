import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { ActivityService, ActivityEntity } from '../activity.service';
import { ConfigsService } from '../../../../common/services/configs.service';
import { Session } from '../../../../services/session';
import { MindsUser, MindsGroup } from '../../../../interfaces/entities';
import * as moment from 'moment';

@Component({
  selector: 'm-activity__ownerBlock',
  templateUrl: 'owner-block.component.html',
})
export class ActivityOwnerBlockComponent implements OnInit, OnDestroy {
  private entitySubscription: Subscription;

  entity: ActivityEntity;

  constructor(
    public service: ActivityService,
    private configs: ConfigsService,
    private session: Session
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

  // Note: currenly ownerBlocks are only visible in minimalMode for reminds
  @HostBinding('class.m-activity__ownerBlock--minimalMode')
  get minimalMode(): boolean {
    return this.service.displayOptions.minimalMode;
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

  /**
   * determines whether the post is scheduled.
   * @returns true if post is scheduled.
   */
  isScheduled(): boolean {
    return (
      this.entity.time_created && this.entity.time_created * 1000 > Date.now()
    );
  }

  /**
   * Converts a date to a human readable datetime e.g. 29/05/2020, 10:32:46.
   * @returns - human readable datetime.
   */
  toReadableDate(seconds: string): string {
    return new Date(parseInt(seconds) * 1000).toLocaleString();
  }
}

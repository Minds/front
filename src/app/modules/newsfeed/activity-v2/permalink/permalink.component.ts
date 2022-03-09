import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConfigsService } from '../../../../common/services/configs.service';
import { Session } from '../../../../services/session';
import {
  ActivityEntity,
  ActivityService,
} from '../../activity/activity.service';
import * as moment from 'moment';

@Component({
  selector: 'm-activityV2__permalink',
  templateUrl: './permalink.component.html',
  styleUrls: ['./permalink.component.ng.scss'],
})
export class ActivityV2PermalinkComponent implements OnInit, OnDestroy {
  private entitySubscription: Subscription;

  entity: ActivityEntity;

  constructor(
    public service: ActivityService,
    public session: Session,
    private configs: ConfigsService
  ) {}

  @HostBinding('class.m-activity__permalink--modal')
  get isModal(): boolean {
    return this.service.displayOptions.isModal;
  }

  // Show absolute dates for items outside the feed
  get isFeed(): boolean {
    return this.service.displayOptions.isFeed;
  }

  get showRelativeDate(): boolean {
    return this.isFeed && !this.isScheduled;
  }

  get isSidebarBoost(): boolean {
    return this.service.displayOptions.isSidebarBoost;
  }

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

  /**
   * Determines whether the post is scheduled.
   * @returns true if post is scheduled.
   */
  isScheduled(): boolean {
    return (
      this.entity.time_created && this.entity.time_created * 1000 > Date.now()
    );
  }

  /**
   * Converts a date to a human readable datetime,
   * e.g. Jul 16 2021 · 2:48pm
   * @returns - human readable datetime.
   */
  toReadableDate(seconds: string): string {
    const date = moment(parseInt(seconds) * 1000).format('MMM D YYYY ');
    const time = moment(parseInt(seconds) * 1000).format('LT');
    return `${date} · ${time}`;
  }
}

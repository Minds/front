import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ConfigsService } from '../../../../common/services/configs.service';
import { Session } from '../../../../services/session';
import {
  ActivityEntity,
  ActivityService,
} from '../../activity/activity.service';
import * as moment from 'moment';
import { map } from 'rxjs/operators';

@Component({
  selector: 'm-activityV2__permalink',
  templateUrl: './permalink.component.html',
  styleUrls: ['./permalink.component.ng.scss'],
})
export class ActivityV2PermalinkComponent implements OnInit, OnDestroy {
  private entitySubscription: Subscription;

  entity: ActivityEntity;

  @HostBinding('class.m-activity__permalink--minimalMode')
  get minimalMode(): boolean {
    return this.service.displayOptions.minimalMode;
  }

  constructor(public service: ActivityService, public session: Session) {}

  /**
   * Show absolute dates for items outside the feed
   */
  get showRelativeDate(): boolean {
    return (
      (this.service.displayOptions.isFeed ||
        this.service.displayOptions.isSidebarBoost ||
        this.service.displayOptions.minimalMode) &&
      !this.isScheduled()
    );
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

  /**
   * MINIMAL MODE ONLY
   *
   * Add spacer where there isn't one already
   * (e.g. in rich-embeds/media posts that don't have
   * a title or message)
   */
  get addTopSpacing() {
    if (
      !this.entity ||
      !this.entity.activity_type ||
      !this.service.displayOptions.minimalMode
    ) {
      return false;
    }
    const entity =
      this.entity.activity_type !== 'quote'
        ? this.entity
        : this.entity.remind_object;

    if (
      this.isRichEmbedWithoutText(entity) ||
      this.isMediaWithoutText(entity)
    ) {
      return true;
    }
    return false;
  }

  isRichEmbedWithoutText(entity: any): boolean {
    return entity.content_type === 'rich-embed' && !entity.message;
  }

  isMediaWithoutText(entity: any): boolean {
    return (
      (entity.content_type === 'image' || entity.content_type === 'video') &&
      !entity.message &&
      !entity.title
    );
  }
}

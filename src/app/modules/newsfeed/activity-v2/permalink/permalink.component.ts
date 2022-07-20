import {
  Component,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ConfigsService } from '../../../../common/services/configs.service';
import { Session } from '../../../../services/session';
import {
  ActivityEntity,
  ActivityService,
} from '../../activity/activity.service';
import * as moment from 'moment';

/**
 * Displays the date/time the post was made. When clicked, it navigates to the post's single activity page.
 *
 * Date/time is displayed in one of two ways (absolute or relative), depending on context.
 * It is absolute if it is a scheduled post, in the modal, or in the single activity page.
 * All other contexts are relative.
 */
@Component({
  selector: 'm-activityV2__permalink',
  templateUrl: './permalink.component.html',
  styleUrls: ['./permalink.component.ng.scss'],
})
export class ActivityV2PermalinkComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[];

  entity: ActivityEntity;

  isRemind: boolean = false;
  isQuote: boolean = false;

  @Input() wasQuoted: boolean = false;

  @HostBinding('class.m-activity__permalink--isStatusBehindPaywall')
  isStatusBehindPaywall: boolean = false;

  @HostBinding('class.m-activity__permalink--minimalMode')
  get minimalMode(): boolean {
    return this.service.displayOptions.minimalMode;
  }

  constructor(public service: ActivityService, public session: Session) {}

  /**
   * Show absolute dates for single pages and modal
   */
  get showRelativeDate(): boolean {
    return (
      (this.service.displayOptions.isFeed ||
        this.service.displayOptions.isSidebarBoost ||
        this.service.displayOptions.minimalMode ||
        this.wasQuoted) &&
      !this.isScheduled()
    );
  }

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
    this.subscriptions.push(
      this.service.isQuote$.subscribe((is: boolean) => {
        this.isQuote = is;
      })
    );
    this.subscriptions.push(
      this.service.shouldShowPaywall$.subscribe((shouldShow: boolean) => {
        this.isStatusBehindPaywall =
          shouldShow && this.entity.content_type === 'status';
      })
    );
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
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
      this.isMediaWithoutText(entity) ||
      this.isRemindWithMedia(entity)
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

  isRemindWithMedia(entity: any): boolean {
    return (
      this.minimalMode &&
      (this.isQuote || this.isRemind) &&
      (entity.content_type === 'image' || entity.content_type === 'video')
    );
  }
}

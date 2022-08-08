import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { ActivityService, ActivityEntity } from '../activity.service';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

/**
 * In activity minimal mode, displays view count.
 */
@Component({
  selector: 'm-activity__minimalMetrics',
  templateUrl: './minimal-metrics.component.html',
  styleUrls: ['./minimal-metrics.component.ng.scss'],
})
export class ActivityMinimalMetricsComponent implements OnInit, OnDestroy {
  private entitySubscription: Subscription;
  private canonicalUrlSubscription: Subscription;

  entity: ActivityEntity;
  canonicalUrl: string;
  contentType: string;

  views$: Observable<number> = this.service.entity$.pipe(
    map((entity: ActivityEntity) => {
      return entity.impressions;
    })
  );

  constructor(public service: ActivityService) {}

  ngOnInit(): void {
    this.entitySubscription = this.service.entity$.subscribe(
      (entity: ActivityEntity) => {
        this.entity = entity;
        if (entity.content_type) {
          this.contentType = entity.content_type;
        }
      }
    );

    this.canonicalUrlSubscription = this.service.canonicalUrl$.subscribe(
      canonicalUrl => {
        if (!this.entity) return;
        this.canonicalUrl = canonicalUrl;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.entitySubscription) {
      this.entitySubscription.unsubscribe();
    }
    if (this.canonicalUrlSubscription) {
      this.canonicalUrlSubscription.unsubscribe();
    }
  }

  /**
   * Add spacer where there isn't one already
   * (e.g. in rich-embeds/media posts that don't have
   * a title or message)
   */
  get addTopSpacing() {
    if (!this.entity || !this.entity.activity_type) {
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
   * Converts a date to a human readable datetime, e.g. Jul 16 2021 · 2:48pm
   * @returns - human readable datetime.
   */
  toReadableDate(seconds: string): string {
    const date = moment(parseInt(seconds) * 1000).format('MMM D YYYY ');
    const time = moment(parseInt(seconds) * 1000).format('LT');
    return `${date} · ${time}`;
  }
}

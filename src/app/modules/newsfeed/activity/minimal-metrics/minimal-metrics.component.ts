import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { ActivityService, ActivityEntity } from '../activity.service';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

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
  recentlyCreated: boolean = true;
  formattedCreateDate: string = '';

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
        // Only display year if post was created before this year
        if (this.entity.time_created) {
          this.recentlyCreated =
            Math.floor(Date.now() / 1000) - this.entity.time_created <= 172800;

          if (!this.recentlyCreated) {
            const createdMoment = moment(this.entity.time_created * 1000);
            const startOfThisYear = moment().startOf('year');
            const formatStr =
              createdMoment > startOfThisYear ? 'MMM Do' : 'MMM Do, YYYY';

            this.formattedCreateDate = createdMoment.format(formatStr);
          }
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
    if (this.entity.activity_type === 'rich-embed' && !this.entity.message) {
      return true;
    }
    if (
      (this.entity.activity_type === 'image' ||
        this.entity.activity_type === 'video') &&
      !this.entity.message &&
      !this.entity.title
    ) {
      return true;
    }
    return false;
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
}

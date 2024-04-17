import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivityModalService } from '../modal.service';
import {
  ActivityEntity,
  ActivityService,
} from '../../../activity/activity.service';
import { Subscription } from 'rxjs';
import { MediumFadeAnimation } from '../../../../../animations';

/**
 * Allows user to page through the other images in a multi-image post.
 * Pager arrows are displayed as an overlay on mouseover (or tap, on tablet)
 */
@Component({
  selector: 'm-activity__modalPager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.ng.scss'],
  animations: [MediumFadeAnimation],
})
export class ActivityModalPagerComponent implements OnInit, OnDestroy {
  currentIndex: number = 0;

  subscriptions: Subscription[];

  entity: ActivityEntity;

  multiImageCount: number;

  hasPrev: boolean = false;
  hasNext: boolean = false;

  constructor(
    public service: ActivityModalService,
    public activityService: ActivityService
  ) {}

  ngOnInit(): void {
    this.subscriptions = [
      this.activityService.entity$.subscribe((entity) => {
        this.entity = entity;

        this.multiImageCount = this.entity.custom_data.length;
      }),
    ];

    this.subscriptions.push(
      this.activityService.activeMultiImageIndex$.subscribe((i) => {
        this.currentIndex = i;

        /**
         * Whenever the image changes,
         * recalculate whether or not to display pager buttons
         */
        this.hasPrev = i > 0;
        this.hasNext = i < this.multiImageCount - 1;
      })
    );
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  /**
   * Go to next entity in horizontal feed
   * and reset entity in activity service
   */
  async goToNext(): Promise<void> {
    if (!this.hasNext) {
      return;
    }

    this.activityService.activeMultiImageIndex$.next(this.currentIndex + 1);
  }

  /**
   * Go to next entity in horizontal feed
   * and reset entity in activity service
   */
  async goToPrev(): Promise<void> {
    if (!this.hasPrev) {
      return;
    }

    this.activityService.activeMultiImageIndex$.next(this.currentIndex - 1);
  }

  /////////////////////////////////////////////////////////////////
  // KEYBOARD SHORTCUTS
  /////////////////////////////////////////////////////////////////
  @HostListener('window:keydown', ['$event']) onWindowKeyDown(
    $event: KeyboardEvent
  ): Boolean {
    if (!this.service.shouldFilterOutKeyDownEvent($event)) {
      switch ($event.key) {
        case 'ArrowLeft':
          this.goToPrev();
          break;
        case 'ArrowRight':
          this.goToNext();
          break;
      }
    }

    return true;
  }
}

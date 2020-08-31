import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivityModalService } from '../modal.service';
import { ActivityService } from '../../activity.service';
import { HorizontalFeedService } from '../../../../../common/services/horizontal-feed.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { MediumFadeAnimation } from '../../../../../animations';

@Component({
  selector: 'm-activity__modalPager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.ng.scss'],
  animations: [MediumFadeAnimation],
})
export class ActivityModalPagerComponent implements OnInit, OnDestroy {
  protected modalPagerSubscription: Subscription;
  protected asyncEntitySubscription: Subscription;

  modalPager = {
    hasPrev: false,
    hasNext: false,
  };

  constructor(
    public service: ActivityModalService,
    public activityService: ActivityService,
    private horizontalFeed: HorizontalFeedService
  ) {}

  ngOnInit(): void {
    /**
     * Whenever user clicks a pager button,
     * recalculate whether or not to display pager buttons
     */
    this.modalPagerSubscription = this.horizontalFeed
      .onChange()
      .subscribe(async change => {
        this.modalPager = {
          hasNext: await this.horizontalFeed.hasNext(),
          hasPrev: await this.horizontalFeed.hasPrev(),
        };
      });

    this.horizontalFeed.setContext('container');
  }

  ngOnDestroy(): void {
    this.clearAsyncEntity();

    if (this.modalPagerSubscription) {
      this.modalPagerSubscription.unsubscribe();
    }
    if (this.asyncEntitySubscription) {
      this.asyncEntitySubscription.unsubscribe();
    }
  }

  setAsyncEntity(asyncEntity: BehaviorSubject<any>): void {
    this.clearAsyncEntity();

    this.asyncEntitySubscription = asyncEntity.subscribe(entity => {
      if (entity) {
        this.service.setEntity(entity);
      }
    });
  }

  clearAsyncEntity(): void {
    if (this.asyncEntitySubscription) {
      this.asyncEntitySubscription.unsubscribe();
      this.asyncEntitySubscription = void 0;
    }
  }

  /**
   * Go to next entity in horizontal feed
   * and reset entity in activity service
   */
  async goToNext(): Promise<void> {
    if (!this.modalPager.hasNext) {
      return;
    }

    this.service.loading$.next(true);

    const response = await this.horizontalFeed.next();

    if (response && response.entity) {
      this.setAsyncEntity(response.entity);
    } else {
      this.service.loading$.next(false);
    }
  }

  /**
   * Go to next entity in horizontal feed
   * and reset entity in activity service
   */
  async goToPrev(): Promise<void> {
    if (!this.modalPager.hasPrev) {
      return;
    }

    this.service.loading$.next(true);

    const response = await this.horizontalFeed.prev();

    if (response && response.entity) {
      this.setAsyncEntity(response.entity);
    } else {
      this.service.loading$.next(false);
    }
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

import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { FeedService } from './feed.service';
import { Router } from '@angular/router';
import { ChannelsV2Service } from '../channels-v2.service';
import { FeedFilterType } from '../../../../common/components/feed-filter/feed-filter.component';
import { FeedsService } from '../../../../common/services/feeds.service';
import { Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

/**
 * Channel feed component
 */
@Component({
  selector: 'm-channel__feed',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'feed.component.html',
  providers: [FeedService, FeedsService],
})
export class ChannelFeedComponent implements OnDestroy {
  /**
   * Parses the view onto the current feed/type
   * @param view
   * @private
   */
  @Input('view') set _view(view: string) {
    switch (view) {
      case 'activities':
      case 'images':
      case 'videos':
      case 'blogs':
        this.feed.sort$.next('latest');
        this.feed.type$.next(view);
        break;

      case 'scheduled':
        this.feed.sort$.next('scheduled');
        this.feed.type$.next('activities');
        break;

      default:
        // TODO: Warning / error / redirect?
        this.feed.sort$.next('latest');
        this.feed.type$.next('activities');
    }
  }

  /**
   * Subscription to channel's GUID
   */
  protected guidSubscription: Subscription;

  /**
   * Constructor
   * @param feed
   * @param service
   * @param router
   */
  constructor(
    public feed: FeedService,
    public service: ChannelsV2Service,
    protected router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    if (isPlatformBrowser(platformId)) {
      this.guidSubscription = this.service.guid$.subscribe(guid =>
        this.feed.guid$.next(guid)
      );
    }
  }

  /**
   * Destroy lifecycle hook
   */
  ngOnDestroy(): void {
    if (this.guidSubscription) {
      this.guidSubscription.unsubscribe();
    }
  }

  /**
   * Type changes
   * @param type
   */
  onTypeChange(type: FeedFilterType) {
    const filter = type !== 'activities' ? type : '';
    this.router.navigate(['/', this.service.username$.getValue(), filter]);
  }
}

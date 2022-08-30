import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  isDevMode,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, map, skip, throttleTime } from 'rxjs/operators';
import { FeaturedContentService } from '../../../common/components/featured-content/featured-content.service';
import { ClientMetaService } from '../../../common/services/client-meta.service';
import { DismissalService } from '../../../common/services/dismissal.service';
import { FeedsUpdateService } from '../../../common/services/feeds-update.service';
import { FeedsService } from '../../../common/services/feeds.service';
import { Client, Upload } from '../../../services/api';
import { Navigation as NavigationService } from '../../../services/navigation';
import { ScrollRestorationService } from '../../../services/scroll-restoration.service';
import { IPageInfo, VirtualScrollerComponent } from './virtual-scroller';

export enum FeedAlgorithm {
  top = 'top',
  latest = 'latest',
}

export enum FeedItemType {
  activity = 'activity',
  feedNotice = 'feedNotice',
  featuredContent = 'featuredContent',
  topHighlights = 'topHighlights',
  channelRecommendations = 'channelRecommendations',
}

export interface IFeedItem {
  type: FeedItemType;
  data?: any;
  id: string;
}

@Component({
  selector: 'm-feed',
  providers: [FeaturedContentService],
  templateUrl: 'feed.component.html',
  styleUrls: ['feed.component.ng.scss'],
})
export class FeedComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input()
  feedService: FeedsService;

  @ViewChild('scroll')
  virtualScroller: VirtualScrollerComponent;

  @ViewChildren('feedViewChildren', { read: ElementRef })
  feedViewChildren: QueryList<ElementRef>;

  feedItems$: Observable<IFeedItem[]>;

  isDev = isDevMode();

  /**
   * Whether top highlights is dismissed
   */
  isTopHighlightsDismissed$ = this.dismissal.dismissed('top-highlights');
  /**
   * Whether channel recommendation is dismissed
   */
  isChannelRecommendationDismissed$ = this.dismissal.dismissed(
    'channel-recommendation:feed'
  );
  loadNextThrottler = new BehaviorSubject<IPageInfo>(null);
  loadNextThrottlerSubscription: Subscription;

  constructor(
    public client: Client,
    public upload: Upload,
    public navigation: NavigationService,
    public router: Router,
    public route: ActivatedRoute,
    protected clientMetaService: ClientMetaService,
    public feedsUpdate: FeedsUpdateService,
    public dismissal: DismissalService,
    public scrollRestoration: ScrollRestorationService,
    public changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.feedItems$ = this.feedService.feed.pipe(
      map(feed => {
        if (!feed.length) return [];

        let feedItems: IFeedItem[] = feed.map((activity$, index) => {
          return {
            type: FeedItemType.activity,
            data: {
              activity$,
              index: index,
              slot: index + 1, // TODO: do we want these slots to take into account injected items
            },
            id: `activity-${
              // @ts-ignore
              activity$?.getValue()?.guid
            }-${this.feedService.id$.getValue()}`,
          };
        });

        // if (this.feedService.injectItems.length) {
        // feedItems = this.injectFeedItems(feedItems);
        // }

        return this.ensureFeedUniqueness(feedItems);
      })
    );

    this.loadNextThrottlerSubscription = this.loadNextThrottler
      .pipe(skip(1), throttleTime(300))
      .subscribe((event: IPageInfo) => this.loadNext(event));
  }

  ngAfterViewInit() {
    if (this.scrollRestoration.getOffsetForRoute(this.router.url)) {
      this.scrollRestoration.restoreScroll(this.router.url);
    }
  }

  ngOnDestroy(): void {
    this.loadNextThrottlerSubscription?.unsubscribe();
  }

  loadNext(event?: IPageInfo) {
    if (!this.feedService.feedLength) return;
    if (event) {
      // only load next if we're in the proximity of the last 8 posts
      if (this.feedService.feedLength - event?.endIndex > 8) return;
    }

    if (
      this.feedService.canFetchMore &&
      !this.feedService.inProgress.getValue() &&
      !this.feedService.fetchInProgress$.getValue() &&
      this.feedService.offset.getValue()
    ) {
      this.feedService.fetch(); // load the next 150 in the background
    }

    this.feedService.loadMore();
  }

  /** used by virtualized list to identify items */
  compareItems = (item1: IFeedItem, item2: IFeedItem) => {
    return this.getIDforFeedItem(item1) === this.getIDforFeedItem(item2);
  };

  /** used by the list to optimize performance */
  feedItemTrackBy = (index: number, feedItem: IFeedItem) => {
    return this.getIDforFeedItem(feedItem);
  };

  private getIDforFeedItem(feedItem: IFeedItem) {
    const id = feedItem.id || feedItem.data?.activity$?.getValue()?.guid;

    return id;
  }

  private ensureFeedUniqueness(feed: IFeedItem[]) {
    const ids = [];
    const uniqueFeed = [];

    feed.map(item => {
      const id = this.getIDforFeedItem(item);
      if (!ids.includes(id)) {
        ids.push(id);
        uniqueFeed.push(item);
      }
    });
    return uniqueFeed;
  }

  /**
   * injects in-feed items into the feed and returns the new list
   * @param {IFeedItem[]} feedItems
   * @returns
   */
  private injectFeedItems(feedItems: IFeedItem[]) {
    const newFeedItems = [...feedItems];

    for (let i = 0; i < feedItems.length; i++) {
      this.feedService.injectItems.map((injectItem, injectItemIndex) => {
        let shouldInject = false;
        if (typeof injectItem.indexes === 'function') {
          shouldInject = injectItem.indexes(i, feedItems.length);
        } else {
          shouldInject = injectItem.indexes.includes(i);
        }

        if (!shouldInject) return;

        const feedId = this.feedService.id$.getValue();

        switch (injectItem.type) {
          case FeedItemType.feedNotice:
            newFeedItems.splice(i, 0, {
              type: FeedItemType.feedNotice,
              id: `feedNotice-${injectItemIndex}-${feedId}`,
            });
            break;
          case FeedItemType.featuredContent:
            newFeedItems.splice(i, 0, {
              type: FeedItemType.featuredContent,
              data: injectItemIndex + 1,
              id: `featuredContent-${injectItemIndex}-${feedId}`,
            });
            break;
          case FeedItemType.topHighlights:
            newFeedItems.splice(i, 0, {
              type: FeedItemType.topHighlights,
              id: `topHighlights-${injectItemIndex}-${feedId}`,
            });
            break;
          case FeedItemType.channelRecommendations:
            newFeedItems.splice(i, 0, {
              type: FeedItemType.channelRecommendations,
              id: `channelRecommendations-${injectItemIndex}-${feedId}`,
            });
            break;
        }
      });
    }

    return newFeedItems;
  }
}

import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Input,
  isDevMode,
  OnInit,
  PLATFORM_ID,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IPageInfo, VirtualScrollerComponent } from 'ngx-virtual-scroller';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { FeaturedContentService } from '../../../common/components/featured-content/featured-content.service';
import { ClientMetaService } from '../../../common/services/client-meta.service';
import { FeedsUpdateService } from '../../../common/services/feeds-update.service';
import { FeedsService } from '../../../common/services/feeds.service';
import { Client, Upload } from '../../../services/api';
import { Navigation as NavigationService } from '../../../services/navigation';
import { ScrollRestorationService } from '../../../services/scroll-restoration.service';

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
  id?: string;
}

@Component({
  selector: 'm-feed',
  providers: [FeaturedContentService],
  templateUrl: 'feed.component.html',
})
export class FeedComponent implements OnInit {
  @Input()
  feedService: FeedsService;

  @ViewChild('scroll')
  virtualScroller: VirtualScrollerComponent;

  @ViewChildren('feedViewChildren', { read: ElementRef })
  feedViewChildren: QueryList<ElementRef>;

  feedItems$: Observable<IFeedItem[]>;

  isDev = isDevMode();

  constructor(
    public client: Client,
    public upload: Upload,
    public navigation: NavigationService,
    public router: Router,
    public route: ActivatedRoute,
    protected clientMetaService: ClientMetaService,
    public feedsUpdate: FeedsUpdateService,
    private scrollRestoration: ScrollRestorationService,
    @Inject(PLATFORM_ID) private platformId: Object,
    public changeDetectorRef: ChangeDetectorRef
  ) {}

  /**
   * injects in-feed items into the feed and returns the new list
   * @param {IFeedItem[]} feedItems
   * @returns
   */
  injectFeedItems(feedItems: IFeedItem[]) {
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

        switch (injectItem.type) {
          case FeedItemType.feedNotice:
            newFeedItems.splice(i, 0, {
              type: FeedItemType.feedNotice,
              id: 'feedNotice-' + injectItemIndex, // TODO
            });
            break;
          case FeedItemType.featuredContent:
            newFeedItems.splice(i, 0, {
              type: FeedItemType.featuredContent,
              data: injectItemIndex + 1,
              id: 'featuredContent-' + injectItemIndex,
            });
            break;
          case FeedItemType.topHighlights:
            newFeedItems.splice(i, 0, {
              type: FeedItemType.topHighlights,
              id: 'topHighlights-' + injectItemIndex,
            });
            break;
          case FeedItemType.channelRecommendations:
            newFeedItems.splice(i, 0, {
              type: FeedItemType.channelRecommendations,
              id: 'channelRecommendations-' + injectItemIndex,
            });
            break;
        }
      });
    }

    return newFeedItems;
  }

  ngOnInit() {
    this.feedItems$ = this.feedService.feed.pipe(
      distinctUntilChanged(),
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
          };
        });

        if (this.feedService.injectItems.length) {
          feedItems = this.injectFeedItems(feedItems);
        }

        return this.ensureFeedUniqueness(feedItems);
      })
    );
  }

  loadNext(event: IPageInfo) {
    // only load next if we're in the proximity of the last 5 posts
    if (!this.feedService.feedLength) return;
    if (this.feedService.feedLength - event?.endIndex > 5) return;

    if (
      this.feedService.canFetchMore &&
      !this.feedService.inProgress.getValue() &&
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
}

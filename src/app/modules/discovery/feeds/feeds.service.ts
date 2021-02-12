import { Injectable, Self, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FeedsService } from '../../../common/services/feeds.service';
import { NSFWSelectorConsumerService } from '../../../common/components/nsfw-selector/nsfw-selector.service';
import { isPlatformServer } from '@angular/common';
import { DiscoveryService } from '../discovery.service';
import { NewPostsService } from '../../../common/services/new-posts.service';

export type DiscoveryFeedsPeriod =
  | '12h'
  | '24h'
  | '7d'
  | '30d'
  | '1y'
  | 'relevant';

export type DiscoveryFeedsContentType = 'all' | 'images' | 'videos' | 'blogs';
export type DiscoveryFeedsContentFilter =
  | 'top'
  | 'latest'
  | 'channels'
  | 'groups'
  | 'trending'
  | 'preferred';
export type DiscoveryFeedsNsfw = number[];

@Injectable()
export class DiscoveryFeedsService {
  entities$ = this.feedsService.feed;
  inProgress$ = this.feedsService.inProgress;
  hasMoreData$ = this.feedsService.hasMore;

  filter$: BehaviorSubject<string> = new BehaviorSubject('preferred');
  nsfw$: BehaviorSubject<any[]>;
  period$: BehaviorSubject<string> = new BehaviorSubject('relevant');
  type$: BehaviorSubject<DiscoveryFeedsContentType> = new BehaviorSubject(
    'all'
  );
  saving$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  readonly activityBasedAlgorithms = ['top', 'topV2', 'latest', 'plusFeed'];

  constructor(
    @Self() private feedsService: FeedsService,
    public nsfwService: NSFWSelectorConsumerService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private discoveryService: DiscoveryService,
    protected newPostsService: NewPostsService
  ) {
    this.nsfwService.build();
    this.nsfw$ = new BehaviorSubject(this.nsfwService.reasons);
  }

  async load(): Promise<void> {
    if (isPlatformServer(this.platformId)) return;
    const isPlusPage: boolean = this.discoveryService.isPlusPage$.value;
    const wireSupportTiersOnly: boolean = this.discoveryService.isWireSupportPage$.getValue();
    let algorithm = this.filter$.value === 'preferred' ? 'topV2' : 'top';

    if (isPlusPage) {
      algorithm = this.filter$.value === 'latest' ? 'latest' : 'plusFeed';
    }

    const type = this.type$.value;

    const endpoint = `api/v2/feeds/global/${algorithm}/${type}`;
    const params = {
      all: this.filter$.value === 'trending' || isPlusPage ? 1 : 0,
      period: this.period$.value,
      nsfw: this.getNsfwString(),
      period_fallback: 0,
      plus: isPlusPage,
      wire_support_tier_only: wireSupportTiersOnly,
    };

    this.feedsService.clear();
    this.feedsService
      .setEndpoint(endpoint)
      .setParams(params)
      .fetch();

    this.pollForNewPosts(algorithm, endpoint, params);
  }

  async search(q: string): Promise<void> {
    if (isPlatformServer(this.platformId)) return;
    this.feedsService.clear();

    const endpoint = 'api/v3/discovery/search';
    const params = {
      q,
      period: this.period$.value,
      algorithm: this.filter$.value,
      nsfw: this.getNsfwString(),
      type: this.type$.value,
      plus: this.discoveryService.isPlusPage$.value,
    };

    this.feedsService
      .setEndpoint(endpoint)
      .setParams(params)
      .fetch();

    this.pollForNewPosts(this.filter$.value, endpoint, params);
  }

  pollForNewPosts(algorithm: string, endpoint: string, params: any): void {
    // Only poll for new posts when the feed consists of activities
    if (this.activityBasedAlgorithms.includes(algorithm)) {
      this.newPostsService
        .setEndpoint(endpoint)
        .setParams(params)
        .poll();
    } else {
      this.newPostsService.reset();
    }
  }

  loadMore(): void {
    this.feedsService.loadMore();
  }

  setFilter(filter: DiscoveryFeedsContentFilter): DiscoveryFeedsService {
    this.filter$.next(filter);
    return this;
  }

  setPeriod(period: DiscoveryFeedsPeriod): DiscoveryFeedsService {
    this.period$.next(period);
    return this;
  }

  setType(type: DiscoveryFeedsContentType): DiscoveryFeedsService {
    this.type$.next(type);
    return this;
  }

  setNsfw(nsfw: any[]): DiscoveryFeedsService {
    this.nsfwService.reasons = nsfw;
    this.nsfwService.saveToCookie();
    this.nsfw$.next(nsfw);
    return this;
  }

  getNsfwString(): string {
    return this.nsfw$.value
      .filter(reason => reason.selected)
      .map(reason => reason.value)
      .join(',');
  }
}

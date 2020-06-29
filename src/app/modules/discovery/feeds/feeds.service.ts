import { Injectable, Self, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FeedsService } from '../../../common/services/feeds.service';
import { NSFWSelectorConsumerService } from '../../../common/components/nsfw-selector/nsfw-selector.service';
import { isPlatformServer } from '@angular/common';
import { DiscoveryService } from '../discovery.service';

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

  constructor(
    @Self() private feedsService: FeedsService,
    public nsfwService: NSFWSelectorConsumerService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private discoveryService: DiscoveryService
  ) {
    this.nsfwService.build();
    this.nsfw$ = new BehaviorSubject(this.nsfwService.reasons);
  }

  async load(): Promise<void> {
    if (isPlatformServer(this.platformId)) return;
    const algorithm = this.filter$.value === 'preferred' ? 'topV2' : 'top';
    const type = this.type$.value;
    this.feedsService.clear();
    this.feedsService
      .setEndpoint(`api/v2/feeds/global/${algorithm}/${type}`)
      .setParams({
        all: this.filter$.value === 'trending' ? 1 : 0,
        period: this.period$.value,
        nsfw: this.getNsfwString(),
        period_fallback: 0,
        plus: this.discoveryService.isPlusPage$.value,
      })
      .fetch();
  }

  async search(q: string): Promise<void> {
    if (isPlatformServer(this.platformId)) return;
    this.feedsService.clear();
    this.feedsService
      .setEndpoint('api/v3/discovery/search')
      .setParams({
        q,
        period: this.period$.value,
        algorithm: this.filter$.value,
        nsfw: this.getNsfwString(),
        type: this.type$.value,
        plus: this.discoveryService.isPlusPage$.value,
      })
      .fetch();
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

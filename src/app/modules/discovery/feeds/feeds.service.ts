import { Injectable, Self } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FeedsService } from '../../../common/services/feeds.service';
import { NSFWSelectorConsumerService } from '../../../common/components/nsfw-selector/nsfw-selector.service';

export type DiscoveryFeedsPeriod =
  | '12h'
  | '24h'
  | '7d'
  | '30d'
  | '1y'
  | 'relevant';

export type DiscoveryFeedsContentType = 'all' | 'images' | 'videos' | 'blogs';
export type DiscoveryFeedsNsfw = number[];

@Injectable()
export class DiscoveryFeedsService {
  entities$ = this.feedsService.feed;
  inProgress$ = this.feedsService.inProgress;
  hasMoreData$ = this.feedsService.hasMore;

  filter$: BehaviorSubject<string> = new BehaviorSubject('preferred');
  nsfw$: BehaviorSubject<any[]>;
  period$: BehaviorSubject<string> = new BehaviorSubject('relevant');
  type$: BehaviorSubject<string> = new BehaviorSubject('all');
  saving$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    @Self() private feedsService: FeedsService,
    public nsfwService: NSFWSelectorConsumerService
  ) {
    this.nsfwService.build();
    this.nsfw$ = new BehaviorSubject(this.nsfwService.reasons);
  }

  async load(): Promise<void> {
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
      })
      .fetch();
  }

  async search(q: string): Promise<void> {
    this.feedsService.clear();
    this.feedsService
      .setEndpoint('api/v3/discovery/search')
      .setParams({
        q,
        period: this.period$.value,
        algorithm: this.filter$.value,
        nsfw: this.getNsfwString(),
      })
      .fetch();
  }

  loadMore(): void {
    this.feedsService.loadMore();
  }

  setFilter(filter: string): DiscoveryFeedsService {
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

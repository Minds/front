import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FeedsService } from '../../../common/services/feeds.service';

@Injectable()
export class DiscoverySearchService {
  entities$ = this.feedsService.feed;
  inProgress$ = this.feedsService.inProgress;

  constructor(private feedsService: FeedsService) {}

  async search(q: string, opts: { filter: string }): Promise<void> {
    this.feedsService.clear();
    this.feedsService
      .setEndpoint('api/v3/discovery/search')
      .setParams({
        q,
        algorithm: opts.filter,
      })
      .fetch();
  }
}

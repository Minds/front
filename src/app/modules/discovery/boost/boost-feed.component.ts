/**
 * Boost feed for discovery module.
 * Plugs into feeds service.
 */
import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FeedsService } from '../../../common/services/feeds.service';
import { DynamicBoostExperimentService } from '../../experiments/sub-services/dynamic-boost-experiment.service';
import { BoostLocation } from '../../boost/modal-v2/boost-modal-v2.types';

@Component({
  selector: 'm-discovery__boostFeed',
  templateUrl: './boost-feed.component.html',
  providers: [FeedsService],
})
export class DiscoveryBoostFeedComponent implements OnInit {
  constructor(
    public route: ActivatedRoute,
    private feedsService: FeedsService,
    private dynamicBoostExperiment: DynamicBoostExperimentService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.load();
  }

  /**
   * Displayed feed of boosts.
   * @returns { Observable<BehaviorSubject<Object>[]> } - feed to be async piped.
   */
  public get feed$(): Observable<BehaviorSubject<Object>[]> {
    return this.feedsService.feed;
  }

  /**
   * Whether the service has more boosts to display.
   * @returns { Observable<boolean> } - true if more boosts can be retrieved.
   */
  public get hasMore$(): Observable<boolean> {
    return this.feedsService.hasMore;
  }

  /**
   * True if currently in progress.
   * @returns { Observable<boolean> } - true if service is currently in progress.
   */
  public get inProgress$(): Observable<boolean> {
    return this.feedsService.inProgress;
  }

  /**
   * Dispatched get request for feed through feedsService.
   * @param { boolean } refresh - true if feed is being refreshed.
   * @return { Promise<boolean> } true if load request completes without errors.
   */
  private async load(refresh: boolean = false): Promise<boolean> {
    try {
      const dynamicBoostExperimentActive: boolean = this.dynamicBoostExperiment.isActive();

      if (refresh) {
        this.feedsService.clear();
      }

      const params = dynamicBoostExperimentActive
        ? {
            location: BoostLocation.NEWSFEED,
          }
        : {
            boostfeed: true,
            force_boost_enabled: true,
          };

      const endpoint: string = dynamicBoostExperimentActive
        ? 'api/v3/boosts/feed'
        : 'api/v2/boost/feed';

      this.feedsService
        .setEndpoint(endpoint)
        .setParams(params)
        .setLimit(12)
        .setOffset(0)
        .fetch();

      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Loads next elements in feed.
   * @returns { Promise<void> } - awaitable.
   */
  public async loadNext(): Promise<void> {
    if (
      this.feedsService.canFetchMore &&
      !this.feedsService.inProgress.getValue() &&
      this.feedsService.offset.getValue()
    ) {
      this.feedsService.fetch(); // load the next 150 in the background
    }
    this.feedsService.loadMore();
  }
}

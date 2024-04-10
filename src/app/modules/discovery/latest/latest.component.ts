/**
 * Latest activities feed for discovery module.
 * Plugs into discovery feeds service.
 * Used in memberships tab and Minds+ latest tab
 */
import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FeedsService } from '../../../common/services/feeds.service';
import { DiscoveryFeedsService } from '../feeds/feeds.service';

@Component({
  selector: 'm-discovery__latestFeed',
  templateUrl: './latest.component.html',
  providers: [DiscoveryFeedsService, FeedsService],
})
export class DiscoveryLatestFeedComponent implements OnInit {
  constructor(
    public route: ActivatedRoute,
    private discoveryFeed: DiscoveryFeedsService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.load();
  }

  /**
   * Displayed feed of membership activities.
   * @returns { Observable<BehaviorSubject<Object>[]> } - feed to be async piped.
   */
  public get feed$(): Observable<BehaviorSubject<Object>[]> {
    return this.discoveryFeed.entities$;
  }

  /**
   * Whether the service has more membership activities to display.
   * @returns { Observable<boolean> } - true if more membership activities can be retrieved.
   */
  public get hasMore$(): Observable<boolean> {
    return this.discoveryFeed.hasMoreData$;
  }

  /**
   * True if currently in progress.
   * @returns { Observable<boolean> } - true if service is currently in progress.
   */
  public get inProgress$(): Observable<boolean> {
    return this.discoveryFeed.inProgress$;
  }

  /**
   * Dispatched get request for feed through feedsService.
   * @param { boolean } refresh - true if feed is being refreshed.
   * @return { Promise<boolean> } true if load request completes without errors.
   */
  private async load(refresh: boolean = false): Promise<boolean> {
    try {
      this.discoveryFeed.setFilter('latest').setType('all').load();
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
    this.discoveryFeed.loadMore();
  }
}

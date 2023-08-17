import { Component, OnInit } from '@angular/core';
import { FeedsService } from '../../../../common/services/feeds.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { BoostLocation } from '../../../boost/modal-v2/boost-modal-v2.types';
import { BoostConsoleService } from '../services/console.service';

/**
 * Presents a feed of boosts
 * under the "explore" tab
 * in the boost console
 */
@Component({
  selector: 'm-boostConsole__feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.ng.scss'],
  providers: [FeedsService],
})
export class BoostConsoleFeedComponent implements OnInit {
  constructor(
    public service: BoostConsoleService,
    private feedsService: FeedsService
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
      if (refresh) {
        this.feedsService.clear();
      }

      this.feedsService
        .setEndpoint('api/v3/boosts/feed')
        .setParams({
          location: BoostLocation.NEWSFEED,
          force_boost_enabled: true,
        })
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

  /**
   * Remove posts from feed when deleted
   * @param entity
   */
  delete(entity) {
    this.feedsService.deleteItem(entity, (item, obj) => {
      return item.guid === obj.guid;
    });
  }
}

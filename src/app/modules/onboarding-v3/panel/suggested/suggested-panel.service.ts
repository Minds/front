import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FeedsService } from '../../../../common/services/feeds.service';

export type OnboardingPanelSuggestionsType = 'channels' | 'groups';

/**
 * Service for handling suggestions panel.
 */
@Injectable({ providedIn: 'root' })
export class OnboardingV3SuggestionsPanelService {
  /**
   * Holds if in progress.
   */
  public readonly inProgress$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  /**
   * Holds observable of suggestions once feeds service has been called.
   * @returns { BehaviorSubject<any> }
   */
  get suggestions$(): BehaviorSubject<any> {
    return this.feeds.rawFeed;
  }

  constructor(private feeds: FeedsService) {}

  /**
   * Load suggestions from server.
   * @returns { Promise<void> }
   */
  public async load(
    type: OnboardingPanelSuggestionsType = 'channels'
  ): Promise<void> {
    // TODO: BH: Implement refresh?
    // if (refresh) {
    //   this.feedsService.clear();
    // }

    this.inProgress$.next(true);

    try {
      const hashtags = '';
      const period = '1y';
      const all = '';
      const query = '';
      const nsfw = [];

      await this.feeds
        .setEndpoint(`api/v2/feeds/global/top/${type}`)
        .setParams({
          hashtags,
          period,
          all,
          query,
          nsfw,
        })
        .setLimit(12)
        .setExportUserCounts(true)
        .fetch();
    } catch (e) {
      console.error('SortedComponent', e);
    }

    this.inProgress$.next(false);
  }
}

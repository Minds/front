import { Injectable } from '@angular/core';
import { Storage } from '../../../services/storage';
import { FeedAlgorithm } from '../../../common/services/feeds.service';
import * as _ from 'lodash';

const FEED_ALGORITHM_STORAGE_KEY = 'feed:algorithm';

/**
 * Stores feed algorithm history in storage
 */
@Injectable()
export class FeedAlgorithmHistoryService {
  constructor(private storage: Storage) {}

  /**
   * Gets last feed algorithm from storage.
   * @returns { string } - feed type a user last accessed.
   */
  get lastAlgorithm(): FeedAlgorithm | undefined {
    let algo = this.storage.get(FEED_ALGORITHM_STORAGE_KEY);
    // Converts for-you to forYou
    algo = _.camelCase(algo);
    return FeedAlgorithm[algo];
  }

  /**
   * Sets last feed algorithm in storage.
   * @param { string } - feed type
   * @returns { void }
   */
  set lastAlgorithm(tab: FeedAlgorithm) {
    this.storage.set(FEED_ALGORITHM_STORAGE_KEY, tab);
  }
}

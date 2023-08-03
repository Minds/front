import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FeedItemType } from '../../modules/newsfeed/feed/feed.component';
import { FeedsService } from './feeds.service';

/**
 * Wrapper for top feeds variant of feeds service.
 */
@Injectable()
export class TopFeedService extends FeedsService {
  endpoint = 'api/v3/newsfeed/feed/unseen-top';
  limit = new BehaviorSubject(12);
  injectItems = [
    {
      type: FeedItemType.feedNotice,
      indexes: i => i > 0 && i % 6 === 0,
    },
    {
      type: FeedItemType.featuredContent,
      indexes: i => (i > 0 && i % 5 === 0) || i === 3,
    },
    {
      type: FeedItemType.publisherRecommendations,
      indexes: (i, feedLength) =>
        feedLength <= 3 ? i === feedLength - 1 : i === 2,
    },
  ];
}

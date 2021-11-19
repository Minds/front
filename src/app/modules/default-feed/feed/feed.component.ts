import {
  Component,
  OnInit,
  QueryList,
  ElementRef,
  ViewChildren,
} from '@angular/core';

import { FeedsService } from '../../../common/services/feeds.service';

/**
 * A default feed for logged-out users.
 * Users subscribers of a recommendations user on the backend.
 */
@Component({
  selector: 'm-defaultFeed',
  templateUrl: 'feed.component.html',
  styleUrls: ['./feed.component.ng.scss'],
})
export class DefaultFeedComponent implements OnInit {
  // feed view children used for J / K scroll
  @ViewChildren('feedViewChildren', { read: ElementRef })
  feedViewChildren: QueryList<ElementRef>;

  constructor(public feedsService: FeedsService) {}

  ngOnInit(): void {
    this.load(true);
  }

  /**
   * Loads the feed.
   * @param { boolean } - are we refreshing?
   * @returns { Promise<void> }
   */
  private async load(refresh: boolean = false): Promise<void> {
    if (refresh) {
      this.feedsService.clear(true);
    }

    try {
      this.feedsService
        .setEndpoint(`api/v3/newsfeed/logged-out`)
        .setLimit(12)
        .fetch(refresh);
    } catch (e) {
      console.error('DefaultFeedComponent', e);
    }
  }

  /**
   * Loads more content to the feed.
   * @returns { Promise<void> }
   */
  public loadNext(): void {
    if (
      this.feedsService.canFetchMore &&
      !this.feedsService.inProgress.getValue() &&
      this.feedsService.offset.getValue()
    ) {
      this.feedsService.fetch();
    }
    this.feedsService.loadMore();
  }
}

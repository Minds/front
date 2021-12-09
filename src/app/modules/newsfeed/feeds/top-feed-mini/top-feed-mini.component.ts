import { Component, OnInit } from '@angular/core';
import { FeedsService } from '../../../../common/services/feeds.service';

@Component({
  selector: 'm-top-feed-mini',
  templateUrl: './top-feed-mini.component.html',
  providers: [FeedsService],
})
export class TopFeedMiniComponent implements OnInit {
  constructor(public feedsService: FeedsService) {}

  ngOnInit(): void {
    this.load();
  }

  loadNext() {
    this.feedsService.setLimit(12);
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
   * loads feed content
   **/
  private load(refresh = false) {
    if (refresh) {
      this.feedsService.clear(true);
    }

    try {
      this.feedsService
        .setEndpoint(`api/v3/newsfeed/feed/unseen-top`)
        .setLimit(3)
        .fetch(refresh);
    } catch (e) {
      console.error('SortedComponent', e);
    }
  }
}

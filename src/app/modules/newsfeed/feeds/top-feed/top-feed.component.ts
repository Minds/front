import { TopFeedService } from './../subscribed.component';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'm-top-feed',
  templateUrl: './top-feed.component.html',
})
export class TopFeedComponent {
  @Input()
  showBoostRotator = true;

  constructor(public topFeedService: TopFeedService) {}

  loadNext() {
    this.topFeedService.setLimit(12);
    if (
      this.topFeedService.canFetchMore &&
      !this.topFeedService.inProgress.getValue() &&
      this.topFeedService.offset.getValue()
    ) {
      this.topFeedService.fetch();
    }
    this.topFeedService.loadMore();
  }
}

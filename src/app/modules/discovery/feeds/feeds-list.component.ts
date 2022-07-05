import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import {
  DiscoveryFeedsService,
  DiscoveryFeedsContentFilter,
} from './feeds.service';
import { Subscription, combineLatest } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

/**
 * A list of discovery-related activities
 * e.g. the feed that follows a list of trending activities
 */
@Component({
  selector: 'm-discovery__feedsList',
  templateUrl: './feeds-list.component.html',
})
export class DiscoveryFeedsListComponent implements OnInit, OnDestroy {
  entities$ = this.service.entities$;
  inProgress$ = this.service.inProgress$;
  hasMoreData$ = this.service.hasMoreData$;
  feedsSubscription: Subscription;

  constructor(private service: DiscoveryFeedsService) {}

  ngOnInit() {
    this.feedsSubscription = combineLatest(
      this.service.nsfw$,
      this.service.type$,
      this.service.period$
    )
      .pipe(debounceTime(300))
      .subscribe(() => {
        this.service.load();
      });
  }

  ngOnDestroy() {
    this.feedsSubscription.unsubscribe();
  }

  loadMore() {
    this.service.loadMore();
  }
}

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import {
  DiscoveryFeedsService,
  DiscoveryFeedsContentFilter,
} from './feeds.service';
import { Subscription, combineLatest } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'm-discovery__feedsList',
  templateUrl: './feeds-list.component.html',
})
export class DiscoveryFeedsListComponent implements OnInit, OnDestroy {
  entities$ = this.service.entities$;
  inProgress$ = this.service.inProgress$;
  hasMoreData$ = this.service.hasMoreData$;
  feedsSubscription: Subscription;

  /**
   * Set wider network endpoint in service.
   * @param { boolean } value - true if wider network endpoint should be used.
   */
  @Input() set widerNetwork(value: boolean) {
    this.service.widerNetwork$.next(value);
  }

  constructor(private service: DiscoveryFeedsService) {}

  ngOnInit() {
    this.feedsSubscription = combineLatest(
      this.service.nsfw$,
      this.service.type$,
      this.service.period$,
      this.service.widerNetwork$
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

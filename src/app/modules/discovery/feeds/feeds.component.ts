import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { DiscoveryFeedsService } from './feeds.service';
import { Subscription, combineLatest } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { FeedsService } from '../../../common/services/feeds.service';

@Component({
  selector: 'm-discovery__feeds',
  templateUrl: './feeds.component.html',
  providers: [DiscoveryFeedsService, FeedsService],
})
export class DiscoveryFeedsComponent implements OnInit, OnDestroy {
  filter: string;
  entities$ = this.service.entities$;
  inProgress$ = this.service.inProgress$;
  hasMoreData$ = this.service.hasMoreData$;
  urlSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private service: DiscoveryFeedsService
  ) {}

  ngOnInit() {
    this.urlSubscription = this.route.url.subscribe(
      (segments: UrlSegment[]) => {
        this.filter = segments[0].path;
        this.service.setFilter(this.filter);
        if (this.filter === 'trending') {
          this.service.setPeriod('12h');
        }
      }
    );
    combineLatest(
      this.service.nsfw$,
      //this.service.filter$,
      this.service.type$,
      this.service.period$
    )
      .pipe(debounceTime(300))
      .subscribe(() => {
        this.service.load();
      });
  }

  ngOnDestroy() {
    this.urlSubscription.unsubscribe();
  }

  loadMore() {
    this.service.loadMore();
  }
}

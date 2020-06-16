import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import {
  DiscoveryFeedsService,
  DiscoveryFeedsContentFilter,
} from './feeds.service';
import { Subscription, combineLatest } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { FeedsService } from '../../../common/services/feeds.service';

@Component({
  selector: 'm-discovery__feeds',
  templateUrl: './feeds.component.html',
  providers: [DiscoveryFeedsService, FeedsService],
})
export class DiscoveryFeedsComponent implements OnInit, OnDestroy {
  filter: DiscoveryFeedsContentFilter;
  urlSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private service: DiscoveryFeedsService
  ) {}

  ngOnInit() {
    this.urlSubscription = this.route.url.subscribe(
      (segments: UrlSegment[]) => {
        this.filter = <DiscoveryFeedsContentFilter>segments[0].path;
        this.service.setFilter(this.filter);
        if (this.filter === 'trending') {
          this.service.setPeriod('12h');
        }
      }
    );
  }

  ngOnDestroy() {
    this.urlSubscription.unsubscribe();
  }
}

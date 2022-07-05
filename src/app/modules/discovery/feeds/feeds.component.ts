import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import {
  DiscoveryFeedsService,
  DiscoveryFeedsContentFilter,
} from './feeds.service';
import { Subscription, combineLatest, Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { FeedsService } from '../../../common/services/feeds.service';
import { DiscoveryService } from '../discovery.service';

/**
 * Discovery feed with actions on the top row
 * e.g. a back button, settings cog and
 * tabs that go to "Your Feed"/"Trending"
 */
@Component({
  selector: 'm-discovery__feeds',
  templateUrl: './feeds.component.html',
  providers: [DiscoveryFeedsService, FeedsService],
})
export class DiscoveryFeedsComponent implements OnInit, OnDestroy {
  filter: DiscoveryFeedsContentFilter;
  urlSubscription: Subscription;

  parentPathSubscription: Subscription;
  parentPath: string = '';

  constructor(
    private route: ActivatedRoute,
    private service: DiscoveryFeedsService,
    private discoveryService: DiscoveryService
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

    this.parentPathSubscription = this.discoveryService.parentPath$.subscribe(
      parentPath => {
        this.parentPath = parentPath;
      }
    );
  }

  ngOnDestroy() {
    this.urlSubscription.unsubscribe();
    this.parentPathSubscription.unsubscribe();
  }
}

import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ConfigsService } from '../../../common/services/configs.service';
import {
  DiscoveryFeedsService,
  DiscoveryFeedsContentType,
  DiscoveryFeedsContentFilter,
} from '../feeds/feeds.service';
import { FeedsService } from '../../../common/services/feeds.service';

import { combineLatest, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'm-discovery__search',
  templateUrl: './search.component.html',
  providers: [DiscoveryFeedsService, FeedsService],
})
export class DiscoverySearchComponent {
  q: string;
  filter: DiscoveryFeedsContentFilter;
  type$ = this.service.type$;
  entities$ = this.service.entities$;
  inProgress$ = this.service.inProgress$;
  hasMoreData$ = this.service.hasMoreData$;
  subscriptions: Subscription[];
  readonly cdnUrl: string;

  constructor(
    private route: ActivatedRoute,
    private service: DiscoveryFeedsService,
    private router: Router,
    configs: ConfigsService
  ) {
    this.cdnUrl = configs.get('cdn_url');
  }

  ngOnInit() {
    this.subscriptions = [
      this.route.queryParamMap
        .pipe(distinctUntilChanged())
        .subscribe((params: ParamMap) => {
          this.q = params.get('q');
          this.filter = <DiscoveryFeedsContentFilter>params.get('f');
          this.service.setFilter(this.filter);
          this.service.setType(
            <DiscoveryFeedsContentType>params.get('t') || 'all'
          );
          this.service.search(this.q);
        }),
      combineLatest(
        this.service.nsfw$,
        this.service.period$,
        this.service.type$,
        this.service.filter$,
        this.route.paramMap
      )
        .pipe(distinctUntilChanged(), debounceTime(300))
        .subscribe(([nsfw, period, type, filter, paramMap]) => {
          // if (filter !== paramMap.get('f') || type !== paramMap.get('t')) {
          //   this.router.navigate([], {
          //     relativeTo: this.route,
          //     queryParams: { q: this.q, f: filter, t: type },
          //     queryParamsHandling: 'merge',
          //   });
          // } else {
          this.service.search(this.q);
          // }
        }),
    ];
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  loadMore() {
    this.service.loadMore();
  }
}

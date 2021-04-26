import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ConfigsService } from '../../../common/services/configs.service';
import {
  DiscoveryFeedsService,
  DiscoveryFeedsContentType,
  DiscoveryFeedsContentFilter,
} from '../feeds/feeds.service';
import { FeedsService } from '../../../common/services/feeds.service';

import { combineLatest, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { MetaService } from '../../../common/services/meta.service';

@Component({
  selector: 'm-discovery__search',
  templateUrl: './search.component.html',
  providers: [DiscoveryFeedsService, FeedsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiscoverySearchComponent {
  q: string;
  filter: DiscoveryFeedsContentFilter;
  type$ = this.service.type$;
  entities$ = this.service.entities$;
  entities: any[] = [];
  inProgress$ = this.service.inProgress$;
  hasMoreData$ = this.service.hasMoreData$;
  subscriptions: Subscription[];
  readonly cdnUrl: string;
  init = false;

  constructor(
    private route: ActivatedRoute,
    private service: DiscoveryFeedsService,
    private router: Router,
    configs: ConfigsService,
    private metaService: MetaService,
    private cd: ChangeDetectorRef
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
          this.setSeo();
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
      this.entities$.subscribe(entities => {
        this.setSeo();

        this.entities = entities;
        this.init = true;

        this.detectChanges();
      }),
      this.inProgress$.subscribe(() => {
        this.detectChanges();
      }),
    ];
  }

  setSeo() {
    this.metaService.setTitle(`${this.q} - Minds Search`);
    this.metaService.setDescription(`Discover ${this.q} posts on Minds.`);
    this.metaService.setCanonicalUrl(
      `/discovery/search?q=${this.q}&f=${this.filter}&t=${this.type$.value}`
    );
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  loadMore() {
    if (this.service.inProgress$.getValue()) {
      return;
    }
    this.service.loadMore();
  }

  detectChanges(): void {
    this.cd.detectChanges();
    this.cd.markForCheck();
  }
}

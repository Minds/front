import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ConfigsService } from '../../../common/services/configs.service';
import { DiscoveryFeedsService } from '../feeds/feeds.service';
import { combineLatest, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'm-discovery__search',
  templateUrl: './search.component.html',
  providers: [DiscoveryFeedsService],
})
export class DiscoverySearchComponent {
  q: string;
  filter: 'top' | 'latest';
  entities$ = this.service.entities$;
  inProgress$ = this.service.inProgress$;
  hasMoreData$ = this.service.hasMoreData$;
  subscriptions: Subscription[];
  readonly cdnUrl: string;

  constructor(
    private route: ActivatedRoute,
    private service: DiscoveryFeedsService,
    configs: ConfigsService
  ) {
    this.cdnUrl = configs.get('cdn_url');
  }

  ngOnInit() {
    this.subscriptions = [
      this.route.queryParamMap.subscribe((params: ParamMap) => {
        this.q = params.get('q');
        this.filter = <'top' | 'latest'>params.get('f');
        this.service.setFilter(this.filter);
        this.service.search(this.q);
      }),
      combineLatest(
        this.service.nsfw$,
        this.service.type$,
        this.service.period$
      )
        .pipe(debounceTime(300))
        .subscribe(() => {
          this.service.search(this.q);
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

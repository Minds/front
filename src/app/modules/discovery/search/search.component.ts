import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DiscoverySearchService } from './search.service';
import { ConfigsService } from '../../../common/services/configs.service';

@Component({
  selector: 'm-discovery__search',
  templateUrl: './search.component.html',
  providers: [DiscoverySearchService],
})
export class DiscoverySearchComponent {
  q: string;
  filter: 'top' | 'latest';
  entities$ = this.service.entities$;
  inProgress$ = this.service.inProgress$;
  hasMoreData$ = this.service.hasMoreData$;
  readonly cdnUrl: string;

  constructor(
    private route: ActivatedRoute,
    private service: DiscoverySearchService,
    configs: ConfigsService
  ) {
    this.cdnUrl = configs.get('cdn_url');
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe((params: ParamMap) => {
      this.q = params.get('q');
      this.filter = <'top' | 'latest'>params.get('f');
      this.service.search(this.q, { filter: this.filter });
    });
  }

  loadMore() {
    this.service.loadMore();
  }
}

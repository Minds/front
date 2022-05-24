import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AbstractSubscriberComponent } from '../../../common/components/abstract-subscriber/abstract-subscriber.component';
import { SuggestionsService } from '../../suggestions/channel/channel-suggestions.service';
import { DiscoveryService } from '../discovery.service';
import { Location } from '@angular/common';

@Component({
  selector: 'm-discovery__suggestions',
  templateUrl: './suggestions.component.html',
  providers: [SuggestionsService],
})
export class DiscoverySuggestionsComponent extends AbstractSubscriberComponent
  implements OnInit, OnDestroy {
  type: string = 'user';
  /**
   * Whether the tabs should be hidden
   */
  hideTabs: boolean = false;
  offset: string = '';
  limit: number = 24;
  entities$ = this.service.suggestions$.pipe(
    map(suggestions => suggestions.map(suggestion => suggestion.entity))
  );
  inProgress$ = this.service.inProgress$;
  hasMoreData$ = this.service.hasMoreData$;

  constructor(
    private route: ActivatedRoute,
    private service: SuggestionsService,
    private discoveryService: DiscoveryService,
    public location: Location
  ) {
    super();
  }

  ngOnInit() {
    this.subscriptions.push(
      combineLatest([this.route.queryParamMap, this.route.url]).subscribe(
        ([queryParamMap, segments]) => {
          const contextualUser = queryParamMap.get('u');
          this.type = segments[0].path;
          // hide tabs to only show user recommendations for the contextual user
          this.hideTabs = Boolean(contextualUser);

          this.service.load({
            limit: this.limit,
            refresh: true,
            type: this.type,
            user: contextualUser,
          });
        }
      )
    );
  }

  loadMore(): void {
    if (this.inProgress$.value) return;
    if (!this.hasMoreData$.value) return;
    this.service.load({
      limit: this.limit,
      refresh: false,
      type: this.type,
    });
  }
}

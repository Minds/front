import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { Subscription, combineLatest, Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { SuggestionsService } from '../../suggestions/channel/channel-suggestions.service';
import { DiscoveryService } from '../discovery.service';

@Component({
  selector: 'm-discovery__suggestions',
  templateUrl: './suggestions.component.html',
  providers: [SuggestionsService],
})
export class DiscoverySuggestionsComponent implements OnInit, OnDestroy {
  type: string = 'user';
  offset: string = '';
  limit: number = 24;
  entities$ = this.service.suggestions$.pipe(
    map(suggestions => suggestions.map(suggestion => suggestion.entity))
  );
  inProgress$ = this.service.inProgress$;
  hasMoreData$ = this.service.hasMoreData$;
  urlSubscription: Subscription;

  parentPathSubscription: Subscription;
  parentPath: string = '';

  constructor(
    private route: ActivatedRoute,
    private service: SuggestionsService,
    private discoveryService: DiscoveryService
  ) {}

  ngOnInit() {
    this.urlSubscription = this.route.url.subscribe(
      (segments: UrlSegment[]) => {
        this.type = segments[0].path;
        this.service.load({
          limit: this.limit,
          refresh: true,
          type: this.type,
        });
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

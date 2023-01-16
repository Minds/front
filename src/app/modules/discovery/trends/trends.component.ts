import {
  Component,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { DiscoveryTrendsService } from './trends.service';
import {
  Router,
  ActivatedRoute,
  RouterEvent,
  NavigationEnd,
} from '@angular/router';
import {
  filter,
  pairwise,
  startWith,
  takeUntil,
  map,
  debounceTime,
} from 'rxjs/operators';
import { Subscription, combineLatest, Observable, BehaviorSubject } from 'rxjs';
import { FastFadeAnimation } from '../../../animations';
import { DiscoveryFeedsService } from '../feeds/feeds.service';
import { FeedsService } from '../../../common/services/feeds.service';
import { SuggestionsService } from '../../suggestions/channel/channel-suggestions.service';
import { Session } from '../../../services/session';

@Component({
  selector: 'm-discovery__trends',
  templateUrl: './trends.component.html',
  animations: [FastFadeAnimation],
  providers: [DiscoveryFeedsService, FeedsService],
})
export class DiscoveryTrendsComponent implements OnInit, OnDestroy {
  isPlusPage$ = this.discoveryService.isPlusPage$;
  trends$ = this.discoveryService.trends$;
  hero$ = this.discoveryService.hero$;
  inProgress$ = this.discoveryService.inProgress$;
  showNoTagsPrompt$: Observable<boolean> = this.discoveryService.error$.pipe(
    map((errorId: string): boolean => {
      return errorId === 'Minds::Core::Discovery::NoTagsException';
    })
  );
  routerEventsSubscription: Subscription;
  showPreferredFeed: boolean = false;

  @Input() showTabs: boolean = true;
  @Input() showChannels: boolean = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private discoveryService: DiscoveryTrendsService,
    private discoveryFeedsService: DiscoveryFeedsService,
    protected suggestionsService: SuggestionsService,
    public session: Session
  ) {}

  ngOnInit() {
    this.routerEventsSubscription = this.router.events
      .pipe(
        filter((event: RouterEvent) => event instanceof NavigationEnd),
        pairwise(),
        filter((events: RouterEvent[]) => events[0].url === events[1].url),
        startWith('Initial call')
        // takeUntil(this.destroyed)
      )
      .subscribe(() => {
        if (
          this.route.snapshot.queryParamMap.get('reload') !== 'false' ||
          !this.trends$.getValue().length
        ) {
          // if we say not to reload or nothing
          this.discoveryService.loadTrends();
        }
      });
    if (this.isPlusPage$.getValue()) {
      this.discoveryFeedsService.setFilter('preferred');
      this.showPreferredFeed = true;
    }
  }

  loadMore() {
    this.discoveryFeedsService.loadMore();
  }

  @HostListener('window:scroll', ['$event']) // for window scroll events
  onScroll(event) {
    if (!this.trends$.value || !this.trends$.value.length) return;
    const element = event.target.activeElement;
    if (
      !this.showPreferredFeed &&
      element.scrollTop + element.clientHeight / 2 >= element.scrollHeight / 2
    ) {
      this.discoveryFeedsService.setFilter('preferred');
      this.showPreferredFeed = true;
    }
  }

  ngOnDestroy() {
    this.routerEventsSubscription.unsubscribe();
  }

  refresh(): void {
    this.discoveryService.loadTrends();
  }
}

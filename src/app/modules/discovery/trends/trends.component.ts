import { Component } from '@angular/core';
import { DiscoveryTrendsService } from './trends.service';
import {
  Router,
  ActivatedRoute,
  RouterEvent,
  NavigationEnd,
} from '@angular/router';
import { filter, pairwise, startWith, takeUntil, map } from 'rxjs/operators';
import { Subscription, combineLatest, Observable } from 'rxjs';
import { FastFadeAnimation } from '../../../animations';

@Component({
  selector: 'm-discovery__trends',
  templateUrl: './trends.component.html',
  animations: [FastFadeAnimation],
})
export class DiscoveryTrendsComponent {
  trends$ = this.discoveryService.trends$;
  hero$ = this.discoveryService.hero$;
  inProgress$ = this.discoveryService.inProgress$;
  showNoTagsPrompt$: Observable<boolean> = this.discoveryService.error$.pipe(
    map((errorId: string): boolean => {
      return errorId === 'Minds::Core::Discovery::NoTagsException';
    })
  );
  routerEventsSubscription: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private discoveryService: DiscoveryTrendsService
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
  }

  ngOnDestroy() {
    this.routerEventsSubscription.unsubscribe();
  }

  refresh(): void {
    this.discoveryService.loadTrends();
  }
}

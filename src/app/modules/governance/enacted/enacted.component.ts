import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { filter, pairwise, startWith } from 'rxjs/operators';
import { GovernanceService } from '../governance.service';
@Component({
  selector: 'm-governance--enacted',
  templateUrl: './enacted.component.html',
})
export class GovernanceEnactedComponent implements OnInit, OnDestroy {
  proposals$ = this.governanceService.proposals$;
  inProgress$ = this.governanceService.inProgress$;
  hasMoreData$ = this.governanceService.hasMoreData$;

  routerEventsSubscription: Subscription;
  current = 12;

  constructor(
    private router: Router,
    private governanceService: GovernanceService
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
      .subscribe(async () => {
        if (!this.proposals$.getValue().length) {
          // if we say not to reload or nothing
          this.governanceService.load({
            limit: 0,
            refresh: true,
            type: 'closed',
          });
        }
      });
  }

  ngOnDestroy() {
    this.governanceService.reset();
  }

  load(type?: string): void {
    if (this.inProgress$.value) return;
    if (!this.hasMoreData$.value) return;
    this.governanceService.load({
      limit: this.current,
      refresh: false,
      type: type ? type : 'closed',
    });
  }
}

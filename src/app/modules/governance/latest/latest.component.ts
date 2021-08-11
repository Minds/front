import { Component, OnInit } from '@angular/core';
import { GovernanceLatestService } from './latest.service';
import { Subscription } from 'rxjs';
import {
  Router,
  ActivatedRoute,
  RouterEvent,
  NavigationEnd,
} from '@angular/router';
import { filter, pairwise, startWith } from 'rxjs/operators';

@Component({
  selector: 'm-governance--latest',
  templateUrl: './latest.component.html',
})
export class GovernanceLatestComponent implements OnInit {
  proposals$ = this.latestService.proposals$;
  totalProposals$ = this.latestService.totalProposals$;
  inProgress$ = this.latestService.inProgress$;
  routerEventsSubscription: Subscription;

  constructor(
    private router: Router,
    private latestService: GovernanceLatestService
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
        if (!this.proposals$.getValue().length) {
          // if we say not to reload or nothing
          this.latestService.loadProposals();
        }
      });
  }
}

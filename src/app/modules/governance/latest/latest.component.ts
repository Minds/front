import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';
import { filter, pairwise, startWith } from 'rxjs/operators';
import { GovernanceService } from '../governance.service';
import { Wallet, WalletV2Service } from '../../wallet/components/wallet-v2.service';

@Component({
  selector: 'm-governance--latest',
  templateUrl: './latest.component.html',
})
export class GovernanceLatestComponent implements OnInit, OnDestroy {
  proposals$ = this.governanceService.proposals$;
  inProgress$ = this.governanceService.inProgress$;
  hasMoreData$ = this.governanceService.hasMoreData$;
  routerEventsSubscription: Subscription;
  tokenBalance;
  current = 12;
  currentFilter = '';

  constructor(
    private router: Router,
    private governanceService: GovernanceService
  ) { }

  ngOnInit() {
    this.routerEventsSubscription = this.router.events
      .pipe(
        filter((event: RouterEvent) => event instanceof NavigationEnd),
        pairwise(),
        filter((events: RouterEvent[]) => events[0].url === events[1].url),
        startWith('Initial call')
      )
      .subscribe(async () => {
        if (!this.proposals$.getValue().length) {
          // if we say not to reload or nothing
          this.governanceService.load({ limit: 0, refresh: true, type: '' });
        }
      });
  }

  ngOnDestroy() {
    this.governanceService.reset();
  }

  load(): void {
    if (this.inProgress$.value) return;
    if (!this.hasMoreData$.value) return;
    this.governanceService.load({
      limit: this.current,
      refresh: false,
      type: this.currentFilter === '' ? '' : this.currentFilter,
    });
  }

  filter(type: string): void {
    this.governanceService.load({
      limit: 0,
      refresh: true,
      type: type,
    });
    if (type !== '') {
      this.currentFilter = type;
    } else {
      this.currentFilter = '';
    }
  }
}

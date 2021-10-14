import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { AnalyticsGlobalTokensService, Metric } from './global-tokens.service';

type TabId = 'supply' | 'transactions' | 'liquidity' | 'rewards';

@Component({
  selector: 'm-analytics__globalTokens',
  templateUrl: './global-tokens.component.html',
  styleUrls: ['./global-tokens.component.ng.scss'],
})
export class AnalyticsGlobalTokensComponent {
  /**
   * The tab we are actively using
   */
  activeTabId: TabId;

  /**
   * Subscription for the param maps of the route
   */
  paramMapSubscription: Subscription;

  /**
   * Observable for the supply metrics
   */
  supply$: Observable<Metric[]> = this.service.supply$;

  /**
   * Observable for the transactions metrics
   */
  transactions$: Observable<Metric[]> = this.service.transactions$;

  /**
   * Observable for the liquidity metrics
   */
  liquidity$: Observable<Metric[]> = this.service.liquidity$;

  /**
   * Observable for the engagement metrics
   */
  rewards$: Observable<Metric[]> = this.service.rewards$;

  /**
   * InProgress subjkect
   */
  inProgress$: BehaviorSubject<boolean> = this.service.inProgress$;

  constructor(
    private service: AnalyticsGlobalTokensService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.paramMapSubscription = this.route.paramMap.subscribe(
      (params: ParamMap) => {
        this.inProgress$.next(true);
        this.activeTabId = <TabId>params.get('tabId');
      }
    );
  }

  ngOnDestroy() {
    this.paramMapSubscription.unsubscribe();
  }
}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { AnalyticsGlobalTokensService, Metric } from './global-tokens.service';
import * as moment from 'moment';

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
   * InProgress subject
   */
  inProgress$: BehaviorSubject<boolean> = this.service.inProgress$;

  /**
   * Supply date filter ranges
   */
  minDate = new Date(1514764800000); // Jan 1 2018
  maxDate = new Date();

  endDate: number = moment(Date.now()).valueOf();

  constructor(
    private service: AnalyticsGlobalTokensService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.paramMapSubscription = this.route.paramMap.subscribe(
      (params: ParamMap) => {
        // this.inProgress$.next(true);
        this.activeTabId = <TabId>params.get('tabId');

        //ojm
        // if (this.activeTabId !== 'supply') {
        //   this.service.setParams({ endTs: moment(this.maxDate).unix() });
        // }
      }
    );
    this.service.fetch();
  }

  onEndDateChange(newDate): void {
    // If today is selected, get current ts instead of end of day
    const ts = Math.min(
      moment(new Date(newDate))
        .endOf('day')
        .unix(),
      Math.floor(Date.now() / 1000)
    );

    console.log('ojm endDate change', newDate, ts);

    // const endOfDayUnix = moment(new Date(newDate))
    //   .endOf('day')
    //   .unix();

    // const ts =
    // console.log('ojm date now', +new Date());

    this.service.setParams({
      endTs: ts,
    });
    this.service.fetch();
  }

  ngOnDestroy() {
    this.paramMapSubscription.unsubscribe();
  }
}

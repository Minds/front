import { Component, Injector, OnInit } from '@angular/core';
import {
  ContributionMetric,
  WalletTokenRewardsService,
} from './rewards.service';
import * as moment from 'moment';
import { Observable, timer } from 'rxjs';
import { UniswapModalService } from '../../../../blockchain/token-purchase/v2/uniswap/uniswap-modal.service';
import { EarnModalService } from '../../../../blockchain/earn/earn-modal.service';
import { map } from 'rxjs/operators';
import { OnchainTransferModalService } from '../../components/onchain-transfer/onchain-transfer.service';
import { WalletV2Service } from '../../wallet-v2.service';

@Component({
  selector: 'm-wallet__tokenRewards',
  templateUrl: './rewards.component.html',
  styleUrls: [
    './rewards.component.ng.scss',
    '../../components/accordion/accordion.component.ng.scss',
  ],
  providers: [WalletTokenRewardsService],
})
export class WalletTokenRewardsComponent implements OnInit {
  /**
   * The reference date
   * */
  date = new Date();

  /**
   * The max date we can select
   */
  maxDate = new Date();

  /**
   * The row to expand
   * */
  expandedRow: string;

  /**
   * Totals
   */
  total = {
    daily: null,
    all_time: null,
  };

  /**
   * The data for the rows
   * TODO: add types
   */
  data;

  /**
   * Obserbale to determine if estimates should be shown
   */
  showEstimates$: Observable<boolean> = this.rewards.dateTs$.pipe(
    map(
      dateTs =>
        dateTs ==
        moment()
          .utc()
          .startOf('d')
          .unix()
    )
  );

  nextPayoutDate$: Observable<number> = timer(0, 1000).pipe(
    map(() => {
      return (
        moment()
          .utc()
          .endOf('day')
          .unix() -
        moment()
          .utc()
          .unix()
      );
    })
  );

  /** Breakdown of relative dates engangement scores */
  contributionScores$: Observable<ContributionMetric[]> = this.rewards
    .contributionScores$;

  /** Breakdown of relative dates liquidity */
  liquidityPositions$: Observable<any> = this.rewards.liquidityPositions$;

  constructor(
    private rewards: WalletTokenRewardsService,
    private uniswapModalService: UniswapModalService,
    private earnModalService: EarnModalService,
    protected injector: Injector,
    protected onchainTransferModal: OnchainTransferModalService,
    private walletService: WalletV2Service
  ) {}

  ngOnInit() {
    this.rewards.rewards$.subscribe(response => {
      this.total = response.total;
      this.data = response;
    });
  }

  /**
   * When the calendar changes, we reload the data
   * @param date
   */
  onDateChange(date) {
    this.date = new Date(date);
    this.total = { daily: null, all_time: null };
    this.data = null;
    this.rewards.setDate(date);
  }

  /**
   *
   */
  toggleRow(rowId: string): void {
    if (this.expandedRow === rowId) {
      this.expandedRow = null;
      return;
    }
    this.expandedRow = rowId;
  }

  /**
   * Returns the date in YYYY-MM-DD format
   */
  private getDate() {
    return (
      this.date.getUTCFullYear() +
      '-' +
      (this.date.getUTCMonth() + 1) +
      '-' +
      this.date.getUTCDate()
    );
  }

  round(number): number {
    return Math.round(number);
  }

  /**
   * Returns the friendly date
   */
  get friendlyDate(): string {
    const d = new Date(this.getDate());
    const m = moment(d.getTime());
    return m.calendar(null, {
      sameDay: '[Today]',
      nextDay: '[Tomorrow]',
      nextWeek: 'MMMM Do YYYY',
      lastDay: '[Yesterday]',
      lastWeek: 'MMMM Do',
      sameElse: () => {
        if (moment().year() === m.year()) {
          return 'MMMM Do';
        } else {
          return 'MMMM Do YYYY';
        }
      },
    });
  }

  get uniswapAccountLink(): string {
    const address = this.walletService.wallet.receiver.address;

    if (!address) {
      return;
    }

    const uniswapUrl = 'https://info.uniswap.org/account/';
    return uniswapUrl + address;
  }

  /**
   * Open the withdraw modal
   * @param e
   */
  async onTransferClick(e: MouseEvent) {
    this.onchainTransferModal
      .setInjector(this.injector)
      .present()
      .toPromise();
  }

  /**
   * Opens the uniswap modal
   * @param e
   */
  onProvideLiquidityClick(e: MouseEvent) {
    this.uniswapModalService.open('add');
  }
}

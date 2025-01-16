import { Component, Injector, OnInit } from '@angular/core';
import {
  ContributionMetric,
  WalletTokenRewardsService,
} from './rewards.service';
import * as moment from 'moment';
import { Observable, Subscription, timer } from 'rxjs';
import { UniswapModalService } from '../../../../blockchain/token-purchase/uniswap/uniswap-modal.service';
import { map, shareReplay } from 'rxjs/operators';
import { OnchainTransferModalService } from '../../components/onchain-transfer/onchain-transfer.service';
import { WalletV2Service } from '../../wallet-v2.service';
import { Session } from '../../../../../services/session';
import { ConnectWalletModalService } from '../../../../blockchain/connect-wallet/connect-wallet-modal.service';
import { MindsUser } from '../../../../../interfaces/entities';
import { VerifyUniquenessModalLazyService } from '../../../../verify-uniqueness/modal/services/verify-uniqueness-modal.service';
import { InAppVerificationExperimentService } from '../../../../experiments/sub-services/in-app-verification-experiment.service';

/**
 * Dashboard view of token rewards.
 * Includes date filter, estimated rewards,
 * breakdowns of where the rewards came from,
 * as well as daily vs. all time subtotals
 *
 * See it at wallet > tokens > rewards
 */
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
   * Has pending transactions.
   */
  public readonly hasPending$ = this.rewards.hasPending$.pipe(shareReplay(1));

  /**
   * The data for the rows
   * TODO: add types
   */
  data;

  /**
   * Obserbale to determine if estimates should be shown
   */
  showEstimates$: Observable<boolean> = this.rewards.dateTs$.pipe(
    map((dateTs) => dateTs == moment().utc().startOf('d').unix())
  );

  nextPayoutDate$: Observable<number> = timer(0, 1000).pipe(
    map(() => {
      return moment().utc().endOf('day').unix() - moment().utc().unix();
    })
  );

  /** Breakdown of relative dates engangement scores */
  contributionScores$: Observable<ContributionMetric[]> =
    this.rewards.contributionScores$;

  /** Breakdown of relative dates liquidity */
  liquidityPositions$: Observable<any> = this.rewards.liquidityPositions$;

  /**
   * Snapshot of isConnected observable
   */
  isConnected: boolean;

  private user: MindsUser;

  /**
   * Subscriptions
   */
  subscriptions: Subscription[] = [];

  constructor(
    private rewards: WalletTokenRewardsService,
    private uniswapModalService: UniswapModalService,
    protected injector: Injector,
    protected onchainTransferModal: OnchainTransferModalService,
    private walletService: WalletV2Service,
    private session: Session,
    private verifyUniquenessModal: VerifyUniquenessModalLazyService,
    private inAppVerificationExperimentService: InAppVerificationExperimentService,
    protected connectWalletModalService: ConnectWalletModalService
  ) {}

  ngOnInit() {
    this.rewards.rewards$.subscribe((response) => {
      this.total = response.total;
      this.data = response;
    });

    this.session.userEmitter.subscribe((user) => {
      this.user = user;
    });

    this.subscriptions.push(
      this.connectWalletModalService.isConnected$.subscribe(
        (isConnected) => (this.isConnected = isConnected)
      )
    );
  }

  /**
   * When the calendar changes, we reload the data
   * @param date
   */
  onDateChange(date) {
    date = this.adjustDateForUtc(date);
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
    const m = moment(this.getDate(), 'YYYY-MM-DD');
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

    const uniswapUrl = 'https://app.uniswap.org/positions/';
    return uniswapUrl + address;
  }

  /**
   * Whether friendly date is 'Today'.
   * @returns { boolean } - true if date is today.
   */
  public isToday(): boolean {
    return this.friendlyDate === 'Today';
  }

  /**
   * Open the withdraw modal
   * @param e
   */
  async onTransferClick(e: MouseEvent) {
    e.stopPropagation();

    this.onchainTransferModal.setInjector(this.injector).present().toPromise();
  }

  /**
   * Opens the uniswap modal
   * @param e
   */
  onProvideLiquidityClick(e: MouseEvent) {
    e.stopPropagation();

    this.uniswapModalService.open('add');
  }

  /**
   * True if opted out of the liquidity spot
   */
  isOptedOutOfLiquiditySpot(): boolean {
    return this.session.getLoggedInUser()?.liquidity_spot_opt_out;
  }

  /**
   * Returns the number of days from the current multiplier provided
   * NOTE: this is only using tokenomicsV2.. changes the tokenomics manifest will need to be reflected here
   * @param multiplier
   */
  calculateDaysFromMultiplier(multiplier: number): number {
    const maxDays = 365;
    const maxMultiplier = 3;
    const minMultiplier = 1;
    const multiplierRange = maxMultiplier - minMultiplier;
    const dailyIncrement = multiplierRange / maxDays; // 0.0054794520

    return (multiplier - minMultiplier) / dailyIncrement;
  }

  async joinRewards(e: MouseEvent) {
    if (this.inAppVerificationExperimentService.isActive()) {
      await this.verifyUniquenessModal.open();
      return;
    }

    const onComplete = () => (this.isConnected = undefined);
    await this.connectWalletModalService.joinRewards(onComplete);
  }

  /**
   * Convert date so that day remains the same when converting to UTC.
   * @param { Date } date - date to adjust.
   * @returns { Date } - adjusted date.
   */
  private adjustDateForUtc(date): Date {
    return new Date(
      date.getTime() + Math.abs(date.getTimezoneOffset() * 1000 * 60)
    );
  }
}

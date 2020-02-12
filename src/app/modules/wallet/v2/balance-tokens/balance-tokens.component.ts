import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
  Inject,
  PLATFORM_ID,
  ViewRef,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Client } from '../../../../services/api/client';
import { Session } from '../../../../services/session';
import { WalletDashboardService } from '../dashboard.service';
import { FormToastService } from '../../../../common/services/form-toast.service';
import * as moment from 'moment';

@Component({
  selector: 'm-walletBalance--tokens',
  templateUrl: './balance-tokens.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletBalanceTokensV2Component implements OnInit, OnDestroy {
  @Input() wallet;
  tokenBalance;
  offchainBalance;
  onchainBalance;
  inProgress = true;
  showModal = false;
  protected updateTimer$;

  // display 2am UTC in local time
  localPayoutTime = moment()
    .utc()
    .startOf('day')
    .add(2, 'hours')
    .local()
    .format('h:mma');
  nextPayoutDate = 0;
  estimatedTokenPayout;
  constructor(
    protected client: Client,
    protected cd: ChangeDetectorRef,
    protected session: Session,
    protected walletService: WalletDashboardService,
    protected formToastService: FormToastService,
    @Inject(PLATFORM_ID) protected platformId: Object
  ) {}

  ngOnInit() {
    this.tokenBalance = this.formatBalance(this.wallet.tokens.balance);
    this.offchainBalance = this.formatBalance(this.wallet.offchain.balance);
    this.onchainBalance = this.formatBalance(this.wallet.onchain.balance);
    this.getPayout();

    this.inProgress = false;
    if (isPlatformBrowser(this.platformId)) {
      this.updateTimer$ = setInterval(
        this.updateNextPayoutDate.bind(this),
        1000
      );
    }

    this.detectChanges();
  }

  ngOnDestroy() {
    if (this.updateTimer$) {
      clearInterval(this.updateTimer$);
    }
  }

  async getPayout() {
    try {
      const result: any = await this.client.get(
        `api/v2/blockchain/contributions/overview`
      );
      if (result) {
        this.nextPayoutDate = result.nextPayout;
        this.estimatedTokenPayout = result.currentReward;
        this.detectChanges();
      }
    } catch (e) {
      console.error(e);
    }
  }

  updateNextPayoutDate() {
    if (this.nextPayoutDate) {
      this.nextPayoutDate--;
      this.detectChanges();
    }
  }

  formatBalance(balance) {
    const formattedBalance = {
      total: balance,
      int: 0,
      frac: null,
    };
    if (balance <= 0) {
      return formattedBalance;
    }
    const splitBalance = balance.toString().split('.');

    formattedBalance.int = splitBalance[0];
    formattedBalance.frac = splitBalance[1];

    return formattedBalance;
  }

  transferComplete() {
    this.formToastService.success('On-chain transfer complete');
    this.showModal = false;
  }

  detectChanges() {
    if (!(this.cd as ViewRef).destroyed) {
      this.cd.markForCheck();
      this.cd.detectChanges();
    }
  }
}

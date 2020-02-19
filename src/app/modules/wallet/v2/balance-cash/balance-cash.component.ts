import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { Client } from '../../../../services/api/client';
import { Session } from '../../../../services/session';
import {
  WalletDashboardService,
  WalletCurrency,
  SplitBalance,
} from '../dashboard.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { ConfigsService } from '../../../../common/services/configs.service';
@Component({
  selector: 'm-walletBalance--cash',
  templateUrl: './balance-cash.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletBalanceCashComponent implements OnInit {
  @Output() scrollToCashSettings: EventEmitter<any> = new EventEmitter();
  @Input() viewId: string;
  @Input() cashWallet: WalletCurrency;

  // TODOOJM
  // private _cashWallet: WalletCurrency;
  // @Input() set cashWallet(value: WalletCurrency) {
  //   this._cashWallet = value;
  // }
  // get wallet(): WalletCurrency {
  //   return this._cashWallet;
  // }

  hasAccount: boolean = false;
  hasBank: boolean = false;
  pendingBalance: SplitBalance;
  totalPaidOut: SplitBalance;
  proEarnings: SplitBalance;
  nextPayoutDate = '';
  currency = 'usd';
  init: boolean = false;

  constructor(
    protected client: Client,
    protected cd: ChangeDetectorRef,
    protected session: Session,
    protected walletService: WalletDashboardService,
    // protected route: ActivatedRoute,
    private configs: ConfigsService
  ) {}

  ngOnInit() {
    // TODOOJM confirm that Mark has migrated all stripe accts to monthly intervals
    // TODOOJM OR just get the payout date from the stripe account itself
    this.nextPayoutDate = moment()
      .endOf('month')
      .format('ddd Do MMM');

    this.hasAccount = this.cashWallet.stripeDetails.hasAccount;
    this.hasBank = this.cashWallet.stripeDetails.hasBank;
    this.pendingBalance = this.cashWallet.stripeDetails.pendingBalanceSplit;
    this.totalPaidOut = this.cashWallet.stripeDetails.totalPaidOutSplit;

    this.currency = this.hasBank ? this.cashWallet.label : 'USD';

    if (this.configs.get('pro')) {
      this.getProEarnings();
    }
    this.init = true;
    this.detectChanges();
  }

  async getProEarnings() {
    try {
      const response: number = await this.walletService.getProEarnings();
      this.proEarnings = this.walletService.splitBalance(response);
    } catch (e) {
      console.error(e.message);
      this.proEarnings = this.walletService.splitBalance(0);
    }
    this.detectChanges();
  }

  scrollToSettings() {
    this.scrollToCashSettings.emit();
    this.detectChanges();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}

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
import { Observable, of, Subscription } from 'rxjs';
import { Client } from '../../../../../services/api/client';
import { Session } from '../../../../../services/session';
import { WalletV2Service, Wallet } from '../../wallet-v2.service';
import { FormToastService } from '../../../../../common/services/form-toast.service';
import * as moment from 'moment';
import { ConnectWalletModalService } from '../../../../blockchain/connect-wallet/connect-wallet-modal.service';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  shareReplay,
  switchMap,
} from 'rxjs/operators';
import { ApiService } from '../../../../../common/api/api.service';

@Component({
  selector: 'm-walletBalance--tokens',
  templateUrl: './balance-tokens.component.html',
  styleUrls: ['./balance-tokens.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletBalanceTokensV2Component implements OnInit, OnDestroy {
  wallet: Wallet;

  tokenBalance;
  offchainBalance;
  onchainBalance;
  inProgress = true;
  showTransferModal = false;
  showTokenModal = false;
  protected updateTimer$;

  isConnected$: Observable<boolean> = this.walletService.wallet$.pipe(
    map(wallet => !!wallet.receiver.address),
    switchMap(hasAddress => {
      if (!hasAddress) {
        return of(false);
      }
      return this.api
        .get('api/v3/blockchain/unique-onchain')
        .pipe(map(response => response.unique));
    })
  );

  /**
   * Snapshot of isConnected observable
   */
  isConnected: boolean;

  /**
   * Subscriptions
   */
  subscriptions: Subscription[] = [];

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
    protected api: ApiService,
    protected cd: ChangeDetectorRef,
    protected session: Session,
    protected walletService: WalletV2Service,
    protected toasterService: FormToastService,
    protected connectWalletModalService: ConnectWalletModalService,
    @Inject(PLATFORM_ID) protected platformId: Object
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.walletService.wallet$.subscribe((wallet: Wallet) => {
        this.wallet = wallet;

        this.tokenBalance = this.walletService.splitBalance(
          this.wallet.tokens.balance
        );
        this.offchainBalance = this.walletService.splitBalance(
          this.wallet.offchain.balance
        );
        this.onchainBalance = this.walletService.splitBalance(
          this.wallet.onchain.balance
        );
        this.detectChanges();
      })
    );

    this.getPayout();

    this.inProgress = false;
    if (isPlatformBrowser(this.platformId)) {
      this.updateTimer$ = setInterval(
        this.updateNextPayoutDate.bind(this),
        1000
      );
    }

    this.subscriptions.push(
      this.isConnected$.subscribe(
        isConnected => (this.isConnected = isConnected)
      )
    );

    this.detectChanges();
  }

  ngOnDestroy() {
    if (this.updateTimer$) {
      clearInterval(this.updateTimer$);
    }
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
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

  async openTransferModal() {
    if (await this.walletService.web3WalletUnlocked()) {
      this.showTransferModal = true;
    }
  }

  updateNextPayoutDate() {
    if (this.nextPayoutDate) {
      this.nextPayoutDate--;
      this.detectChanges();
    }
  }

  transferComplete() {
    this.toasterService.success('On-chain transfer complete');
    this.showTransferModal = false;
  }

  detectChanges() {
    if (!(this.cd as ViewRef).destroyed) {
      this.cd.markForCheck();
      this.cd.detectChanges();
    }
  }

  /**
   * Connect wallet
   * @param e
   */
  async connectWallet(e: MouseEvent): Promise<void> {
    await this.connectWalletModalService.open();
    this.isConnected = undefined;
    await this.walletService.loadOffchainAndReceiver();
  }

  get truncatedOnchainAddress(): string {
    if (!this.wallet.receiver.address) {
      return '';
    }
    return (
      this.wallet.receiver.address.substr(0, 4) +
      '...' +
      this.wallet.receiver.address.substr(-4)
    );
  }
}

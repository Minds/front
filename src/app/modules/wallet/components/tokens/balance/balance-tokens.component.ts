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
  Injector,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { Client } from '../../../../../services/api/client';
import { Session } from '../../../../../services/session';
import { WalletV2Service, Wallet } from '../../wallet-v2.service';
import { FormToastService } from '../../../../../common/services/form-toast.service';
import * as moment from 'moment';
import { OnchainTransferModalService } from '../../components/onchain-transfer/onchain-transfer.service';
import { PhoneVerificationService } from '../../components/phone-verification/phone-verification.service';
import { ConnectWalletModalService } from '../../../../blockchain/connect-wallet/connect-wallet-modal.service';
import { ApiService } from '../../../../../common/api/api.service';

/**
 * Displays:
 * - token balance (with popover of offchain vs. onchain breakdown )
 * - web3 wallet balance (ETH and USD equivalent)
 * - web3 wallet address (truncated)
 * - token-related actions dropdown menu
 */
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
  showTokenModal = false;
  protected updateTimer$;

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
    protected onchainTransferModal: OnchainTransferModalService,
    private injector: Injector,
    protected connectWalletModalService: ConnectWalletModalService,
    private phoneVerificationService: PhoneVerificationService,
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
      this.connectWalletModalService.isConnected$.subscribe(
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
    this.onchainTransferModal
      .setInjector(this.injector)
      .present()
      .toPromise();
  }

  updateNextPayoutDate() {
    if (this.nextPayoutDate) {
      this.nextPayoutDate--;
      this.detectChanges();
    }
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
    const onComplete = () => (this.isConnected = undefined);
    await this.connectWalletModalService.joinRewards(onComplete);
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

import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
  Injector,
} from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { Client } from '../../../../../services/api';
import { Session } from '../../../../../services/session';
import { WalletV2Service } from '../../wallet-v2.service';
import { WithdrawContractService } from '../../../../blockchain/contracts/withdraw-contract.service';
import { ConfigsService } from '../../../../../common/services/configs.service';
import { ToasterService } from '../../../../../common/services/toaster.service';
import { PhoneVerificationService } from '../phone-verification/phone-verification.service';
import { WireCreatorComponent } from '../../../../wire/v2/creator/wire-creator.component';
import { WirePaymentHandlersService } from '../../../../wire/wire-payment-handlers.service';
import { Web3WalletService } from '../../../../blockchain/web3-wallet.service';
import { ModalService } from '../../../../../services/ux/modal.service';
import { EmailConfirmationService } from '../../../../../common/components/email-confirmation/email-confirmation.service';

/**
 * Modal that allows users to transfer tokens from off-chain to on-chain wallets
 *
 * See it by selecting "transfer on-chain" in the wallet > tokens > meatball menu (next to wallet address)
 */
@Component({
  moduleId: module.id,
  selector: 'm-walletOnchainTransfer',
  templateUrl: './onchain-transfer.component.html',
  styleUrls: ['./onchain-transfer.component.ng.scss'],
  providers: [PhoneVerificationService],
})
export class WalletOnchainTransferComponent implements OnInit, OnDestroy {
  form;
  wallet;
  balance: number = 0;
  ethBalance: number = 0;
  amountSubscription: Subscription;

  // secret to be retrieved from can-withdraw endpoint, and provided with final submission
  secret: string = '';
  canTransfer = true; // whether the user can withdraw from wallet
  phoneVerified = false;
  isPlus = false;
  submitError = '';
  transferring: boolean = false;
  loading: boolean = true;

  phoneVerifiedSubscription: Subscription;

  readonly cdnAssetsUrl: string;
  readonly transferLimit: number;

  /**
   * Determines whether the max transfer amount used in validation
   * is user's balance or the transfer limit from configs.
   */
  balanceIsLimit: boolean = true;

  constructor(
    protected session: Session,
    protected client: Client,
    protected contract: WithdrawContractService,
    protected walletService: WalletV2Service,
    protected toasterService: ToasterService,
    protected modalService: ModalService,
    protected phoneVerificationService: PhoneVerificationService,
    protected wirePaymentHandlers: WirePaymentHandlersService,
    protected web3Wallet: Web3WalletService,
    protected emailConfirmation: EmailConfirmationService,
    configs: ConfigsService
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');

    this.transferLimit = configs.get('blockchain').withdraw_limit;
  }

  setModalData() {}

  async ngOnInit() {
    if (!this.web3Wallet.checkDeviceIsSupported()) {
      this.modalService.dismissAll();
      return;
    }
    this.phoneVerifiedSubscription =
      this.phoneVerificationService.phoneVerified$.subscribe((verified) => {
        this.phoneVerified = verified;
      });
    this.isPlus = this.session.getLoggedInUser().plus;
    this.load();
  }

  async load() {
    this.loading = true;
    this.submitError = '';

    await this.walletService.getTokenAccounts();

    this.wallet = this.walletService.wallet;

    this.balance = this.wallet.offchain.balance;
    this.balanceIsLimit = this.balance < this.transferLimit;

    const maxAmount = this.balanceIsLimit ? this.balance : this.transferLimit;

    this.ethBalance = this.wallet.eth.balance;

    this.form = new UntypedFormGroup({
      amount: new UntypedFormControl(maxAmount, {
        validators: [
          Validators.required,
          Validators.max(maxAmount),
          Validators.min(0),
          this.validateMoreThanZero,
        ],
      }),
    });

    this.amountSubscription = this.form
      .get('amount')
      .valueChanges.subscribe((changes) => {
        this.submitError = '';
      });

    const canTransferResponse = await this.walletService.canTransfer();

    this.canTransfer = canTransferResponse.canWithdraw;
    this.secret = canTransferResponse.secret ?? '';

    this.loading = false;
  }

  validateMoreThanZero(control: AbstractControl) {
    if (control.value <= 0 || control.value === -0) {
      return { moreThanZero: true }; // true if invalid
    }
    return null; // null if valid
  }

  async transfer() {
    if (!this.isPlus || !this.phoneVerified) {
      return;
    }

    if (!this.secret) {
      this.toasterService.error('Unable to authenticate');
    }

    if (await this.walletService.web3WalletUnlocked()) {
      try {
        this.transferring = true;

        const result: {
          address;
          guid;
          amount;
          gas;
          tx;
        } = await this.contract.request(
          this.session.getLoggedInUser().guid,
          this.web3Wallet.toWei(this.amount.value, 'ether')
        );

        const response: any = await this.client.post(
          `api/v2/blockchain/transactions/withdraw`,
          { secret: this.secret, ...result }
        );

        if (response.done) {
          this.transferComplete();
          this.toasterService.success(
            'Your on-chain transfer request is pending review. Please allow up to 72 hours for processing'
          );
        } else {
          this.submitError = 'Server error';
        }
      } catch (e) {
        console.error(e);
        if (e.code === 401) {
          this.toasterService.error(
            'Authentication failed, please contact the admin team with your transaction id'
          );
          this.submitError =
            'Authentication failed, please contact the admin team';
        } else {
          this.toasterService.error(
            e.message ??
              'Unknown error, please contact the admin team with your transaction id'
          );
          this.submitError =
            e.message ?? 'Unknown server error, please contact the admin team';
        }
      } finally {
        this.transferring = false;
      }
    }
  }

  onSubmit() {
    if (this.form.valid && this.canTransfer) {
      this.transfer();
    }
  }

  isFormValid() {
    return this.form.valid && this.canTransfer;
  }

  get amount() {
    return this.form.get('amount');
  }

  get web3WalletWorks() {
    return this.form.get('web3WalletWorks');
  }

  get meetsRequirements() {
    return this.phoneVerified && this.isPlus;
  }

  async openPhoneVerificationModal() {
    if (!this.emailConfirmation.ensureEmailConfirmed()) return;
    this.phoneVerificationService.open();
  }

  async openPlusSubscriptionModal(): Promise<void> {
    if (this.session.getLoggedInUser().plus) {
      this.isPlus = true;
      return;
    }

    const modal = this.modalService.present(WireCreatorComponent, {
      size: 'lg',
      data: {
        entity: await this.wirePaymentHandlers.get('plus'),
        default: {
          type: 'money',
          upgradeType: 'plus',
        },
        onComplete: () => {
          this.isPlus = true;
          this.session.getLoggedInUser().plus = true;
          this.toasterService.success('Welcome to Minds+');
          modal.dismiss();
        },
      },
    });
  }

  transferComplete(): void {
    this.toasterService.success('On-chain transfer request submitted.');
    this.modalService.dismissAll();
  }

  ngOnDestroy(): void {
    this.modalService.dismissAll();
    if (this.amountSubscription) {
      this.amountSubscription.unsubscribe();
    }
    if (this.phoneVerifiedSubscription) {
      this.phoneVerifiedSubscription.unsubscribe();
    }
  }
}

import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Client } from '../../../../services/api';
import { Session } from '../../../../services/session';
import { FormToastService } from '../../../../common/services/form-toast.service';
import { WalletDashboardService } from '../dashboard.service';

import { WithdrawContractService } from '../../../blockchain/contracts/withdraw-contract.service';
import { Web3WalletService } from '../../../blockchain/web3-wallet.service';
@Component({
  moduleId: module.id,
  selector: 'm-walletOnchainTransfer',
  templateUrl: './onchain-transfer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletOnchainTransferComponent implements OnInit {
  // TODOOJM make sure this is accurate even if user has updated address in settings
  wallet;
  balance: number = 0;

  alreadyTransferredToday: boolean = false;
  error: string = '';

  inProgress: boolean = false;
  transferComplete: boolean = false;

  form;
  // form = this.fb.group({
  //   amount: [this.amount],
  // });

  constructor(
    protected session: Session,
    private formToastService: FormToastService,
    private fb: FormBuilder,
    protected client: Client,
    protected cd: ChangeDetectorRef,
    protected contract: WithdrawContractService,
    protected web3Wallet: Web3WalletService,
    protected walletService: WalletDashboardService
  ) {}

  // TODOOJM reset after closing modal
  async ngOnInit() {
    this.load();
  }

  get amount() {
    return this.form.get('amount');
  }
  async load() {
    this.inProgress = true;
    this.error = '';
    this.detectChanges();
    this.wallet = await this.walletService.getWallet();

    this.balance = this.wallet.offchain.balance;

    this.form = new FormGroup({
      amount: new FormControl(this.balance, [
        Validators.required,
        Validators.min(0),
        Validators.max(this.balance),
        //already Transferred today
        // ------------------
        // web3 #1 no wallets
        // web3 #2 locked
        // forbiddenNameValidator(/bob/i), // <-- Here's how you pass in the custom validator.
      ]),
    });

    try {
      await this.checkPreviousTransfers();
    } catch (e) {
      this.blockTransfersToday();
    }
    this.detectChanges();

    // this.setAmount(this.amount);

    this.inProgress = false;
    this.detectChanges();
  }

  async checkPreviousTransfers() {
    const response: any = await this.client.post(
      'api/v2/blockchain/transactions/can-withdraw'
    );
    if (!response.canWithdraw) {
      this.blockTransfersToday();
    }
  }

  blockTransfersToday() {
    this.error = 'You can only transfer once per day.';
    this.alreadyTransferredToday = true;
  }

  // setAmount(amount: number | string) {
  //   if (!amount) {
  //     this.amount = 0;
  //     return;
  //   }

  //   if (typeof amount === 'number') {
  //     this.amount = amount;
  //     this.detectChanges();
  //     return;
  //   }

  //   amount = amount.replace(/,/g, '');
  //   this.amount = parseFloat(amount);
  //   this.detectChanges();
  // }

  canTransfer() {
    return (
      !this.inProgress &&
      !this.error &&
      this.amount.value > 0 &&
      this.amount.value <= this.balance
    );
  }

  async transfer() {
    if (!this.canTransfer()) {
      return;
    }

    this.inProgress = true;
    this.error = '';
    this.detectChanges();

    try {
      await this.web3Wallet.ready();

      if (this.web3Wallet.isUnavailable()) {
        this.error = 'No Ethereum wallets are available on your browser.';
      } else if (!(await this.web3Wallet.unlock())) {
        this.error =
          'Your Ethereum wallet is locked or connected to another network.';
      }

      const result: {
        address;
        guid;
        amount;
        gas;
        tx;
      } = await this.contract.request(
        this.session.getLoggedInUser().guid,
        this.amount * Math.pow(10, 18)
      );

      const response: any = await this.client.post(
        `api/v2/blockchain/transactions/withdraw`,
        result
      );

      if (response.done) {
        this.refresh();
      } else {
        this.error = 'Server error';
      }
    } catch (e) {
      console.error(e);
      this.error = (e && e.message) || 'Server error';
    } finally {
      this.inProgress = false;
      this.detectChanges();
    }
  }

  refresh() {
    this.load();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}

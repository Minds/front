import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { Client } from '../../../../../services/api';
import { Session } from '../../../../../services/session';
import { WalletV2Service } from '../../wallet-v2.service';
import { WithdrawContractService } from '../../../../blockchain/contracts/withdraw-contract.service';

@Component({
  moduleId: module.id,
  selector: 'm-walletOnchainTransfer',
  templateUrl: './onchain-transfer.component.html',
})
export class WalletOnchainTransferComponent implements OnInit, OnDestroy {
  form;
  wallet;
  balance: number = 0;
  amountSubscription: Subscription;

  canTransfer = true;
  submitError = '';
  transferring: boolean = false;
  loading: boolean = true;
  @Output() transferComplete: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    protected session: Session,
    protected client: Client,
    protected contract: WithdrawContractService,
    protected walletService: WalletV2Service
  ) {}

  async ngOnInit() {
    this.load();
  }

  async load() {
    this.loading = true;
    this.submitError = '';
    this.wallet = await this.walletService.wallet;

    this.balance = this.wallet.offchain.balance;

    this.form = new FormGroup({
      amount: new FormControl(this.balance, {
        validators: [
          Validators.required,
          Validators.max(this.balance),
          Validators.min(0),
          this.validateMoreThanZero,
        ],
      }),
    });

    this.amountSubscription = this.form
      .get('amount')
      .valueChanges.subscribe(changes => {
        this.submitError = '';
      });

    this.canTransfer = await this.walletService.canTransfer();

    this.loading = false;
  }

  validateMoreThanZero(control: AbstractControl) {
    if (control.value <= 0 || control.value === -0) {
      return { moreThanZero: true }; // true if invalid
    }
    return null; // null if valid
  }

  async transfer() {
    if (await !this.walletService.web3WalletUnlocked()) {
      this.submitError =
        'Your Ethereum wallet is locked or connected to another network';
      return;
    }

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
        this.amount.value * Math.pow(10, 18)
      );

      const response: any = await this.client.post(
        `api/v2/blockchain/transactions/withdraw`,
        result
      );

      if (response.done) {
        this.transferComplete.emit();
      } else {
        this.submitError = 'Server error';
      }
    } catch (e) {
      console.error(e);
      this.submitError = (e && e.message) || 'Server error';
    } finally {
      this.transferring = false;
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

  ngOnDestroy() {
    if (this.amountSubscription) {
      this.amountSubscription.unsubscribe();
    }
  }
}

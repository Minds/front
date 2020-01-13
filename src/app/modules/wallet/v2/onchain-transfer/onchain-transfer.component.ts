import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Client } from '../../../../services/api';
import { Session } from '../../../../services/session';
import { FormToastService } from '../../../../common/services/form-toast.service';
import { WalletDashboardService } from '../dashboard.service';

import { WithdrawContractService } from '../../../blockchain/contracts/withdraw-contract.service';
import { Web3WalletService } from '../../../blockchain/web3-wallet.service';
import * as BN from 'bn.js';

@Component({
  moduleId: module.id,
  selector: 'm-walletOnchainTransfer',
  templateUrl: './onchain-transfer.component.html',
})
export class WalletOnchainTransferComponent implements OnInit {
  form;
  wallet;
  balance: number = 0;

  error = '';
  inProgress: boolean = false;
  @Output() transferComplete: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    protected session: Session,
    private formToastService: FormToastService,
    protected client: Client,
    protected contract: WithdrawContractService,
    protected web3Wallet: Web3WalletService,
    protected walletService: WalletDashboardService
  ) {}

  async ngOnInit() {
    this.load();
  }

  async load() {
    this.inProgress = true;
    this.error = '';
    this.wallet = await this.walletService.getWallet();

    this.balance = this.wallet.offchain.balance;

    this.form = new FormGroup({
      amount: new FormControl(this.balance, {
        validators: [
          Validators.required,
          Validators.max(this.balance),
          this.validateMoreThanZero,
        ],
        asyncValidators: [this.validateCanTransfer.bind(this)],
      }),

      web3WalletWorks: new FormControl(true, {
        validators: null,
        asyncValidators: [this.validateWeb3WalletUnlocked.bind(this)],
      }),
    });

    this.inProgress = false;
  }

  validateMoreThanZero(control: AbstractControl) {
    if (control.value && control.value <= 0) {
      return { moreThanZero: true };
    }
    return null; // null if valid
  }

  async validateCanTransfer() {
    return (await this.walletService.canTransfer())
      ? null
      : { canTransfer: true };
  }

  async validateWeb3WalletUnlocked() {
    return (await this.walletService.web3WalletUnlocked())
      ? null
      : { unlocked: true };
  }

  async transfer() {
    try {
      this.inProgress = true;

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
        this.error = 'Server error';
      }
    } catch (e) {
      console.error(e);
      this.error = (e && e.message) || 'Server error';
    } finally {
      this.inProgress = false;
    }
  }

  onSubmit() {
    if (this.form.valid) {
      if (this.error) {
        this.load();
      } else {
        this.transfer();
      }
    }
  }

  isInvalid() {
    let invalid = this.form.invalid;
    if (this.error) {
      invalid = true;
    }
    return invalid;
  }

  get amount() {
    return this.form.get('amount');
  }

  get web3WalletWorks() {
    return this.form.get('web3WalletWorks');
  }
}

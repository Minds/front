import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { requiredFor, optionalFor } from '../settings-cash.validators';
import { WalletV2Service } from '../../../wallet-v2.service';
import { FormToastService } from '../../../../../../common/services/form-toast.service';

/**
 * Dynamic form that displays/updates the bank account that will receive cash rewards.
 */
@Component({
  selector: 'm-walletCashBankForm',
  templateUrl: './cash-bank-form.component.html',
})
export class WalletCashBankFormComponent implements OnInit {
  @Input() allowedCountries: string[];
  @Input() hasBank: boolean = false;
  @Input() account;
  @Output() submitted: EventEmitter<any> = new EventEmitter();
  form;
  error: string = '';

  inProgress: boolean = false;
  editing: boolean = false;
  showModal: boolean = false;
  modalContent: 'leaveEditMode' | 'leaveMonetization' | 'removeBank';
  leftMonetization: boolean = false;

  initCountry: string;

  constructor(
    private cd: ChangeDetectorRef,
    protected walletService: WalletV2Service,
    private fb: FormBuilder,
    private toasterService: FormToastService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      country: ['US', Validators.required],
      accountNumber: ['', Validators.required],
      routingNumber: ['', requiredFor(['US'])],
    });

    if (this.account) {
      this.initCountry = this.hasBank
        ? this.account.bankAccount.country
        : this.account.country;
      this.country.setValue(this.initCountry);
      this.editing = !this.hasBank;
    }
  }

  async removeBank(): Promise<void> {
    this.showModal = false;
    this.inProgress = true;
    this.detectChanges();

    try {
      const response = await this.walletService.removeStripeBank();

      this.toasterService.success(
        'Your bank account was successfully removed.'
      );
    } catch (e) {
      this.toasterService.error(e.message);
    }

    this.inProgress = false;
    this.detectChanges();

    if (!this.error) {
      this.submitted.emit();
    }
  }

  async addBank(): Promise<void> {
    if (!this.form.valid) {
      return;
    }
    this.error = '';
    this.inProgress = true;
    this.detectChanges();

    try {
      const response = await this.walletService.addStripeBank(this.form.value);

      this.editing = false;

      if (response.status !== 'error') {
        const toasterMessage = 'Your bank account has been successfully added';
        this.toasterService.success(toasterMessage);
      }
    } catch (e) {
      // TODO backend should include e.param and handle errors inline
      this.error = e.message;
    }

    this.inProgress = false;
    this.detectChanges();

    if (!this.error) {
      this.submitted.emit();
    }
  }

  cancelEdits() {
    if (this.routingNumber.dirty || this.accountNumber.dirty) {
      this.showModal = true;
      this.modalContent = 'leaveEditMode';
    } else {
      this.leaveEditMode();
    }
  }

  enterEditMode() {
    this.editing = true;
    this.detectChanges();
  }

  leaveEditMode() {
    this.showModal = false;
    this.editing = false;
    // this.form.reset();
    this.routingNumber.reset();
    this.accountNumber.reset();
    this.detectChanges();
  }

  countryChange($event) {
    this.country.setValue($event);
  }

  // DISABLED b/c 'remove' button makes it redundant
  // async leaveMonetization() {
  //   this.showModal = false;
  //   this.inProgress = true;
  //   this.detectChanges();
  //   this.walletService
  //     .leaveMonetization()
  //     .then((response: any) => {
  //       this.configs.set('merchant', []);
  //       this.leftMonetization = true;
  //     })
  //     .catch(e => {
  //       this.toasterService.error(e.message);
  //     });
  //   this.inProgress = false;
  //   this.detectChanges();
  // }

  isCountry(countries: string[]) {
    return countries.indexOf(this.country.value) > -1;
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  get accountNumber() {
    return this.form.get('accountNumber');
  }
  get routingNumber() {
    return this.form.get('routingNumber');
  }
  get country() {
    return this.form.get('country');
  }
}

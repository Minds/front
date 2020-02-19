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
import { WalletDashboardService } from '../../dashboard.service';
import { FormToastService } from '../../../../../common/services/form-toast.service';

import localLabels from './local-labels';

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

  inProgress: boolean = true;
  editing: boolean = false;
  showModal: boolean = false;
  modalContent: 'leaveEditMode' | 'leaveMonetization' | 'removeBank';
  leftMonetization: boolean = false;

  initCountry: string;

  constructor(
    private cd: ChangeDetectorRef,
    protected walletService: WalletDashboardService,
    private fb: FormBuilder,
    private formToastService: FormToastService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      country: ['', Validators.required],
      accountNumber: ['', Validators.required],
      routingNumber: ['', requiredFor(['US'])],
    });
    if (this.account) {
      this.initCountry = this.hasBank
        ? this.account.bankAccount.country
        : this.account.country;
      this.country.patchValue(this.initCountry);

      this.editing = !this.hasBank;
    }

    this.inProgress = false;
    this.detectChanges();
  }

  async removeBank() {
    this.showModal = false;
    this.inProgress = true;
    this.detectChanges();

    this.walletService
      .removeStripeBank()
      .then((response: any) => {
        this.formToastService.success(
          'Your bank account was successfully removed.'
        );
      })
      .catch(e => {
        this.formToastService.error(e.message);
      });
    this.inProgress = false;
    this.detectChanges();

    if (!this.error) {
      this.submitted.emit();
    }
  }

  async addBank() {
    if (!this.form.valid) {
      return;
    }
    this.error = '';
    this.inProgress = true;
    this.detectChanges();

    this.walletService
      .addStripeBank(this.form.value)
      .then((response: any) => {
        console.log('addBank response', response);
        this.editing = false;

        if (response.status !== 'error') {
          const toasterMessage =
            'Your bank account has been successfully added';
          this.formToastService.success(toasterMessage);
        }
      })
      .catch(e => {
        // TODO backend should include e.param and handle errors inline
        this.error = e.message;
      });
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
  //       this.formToastService.error(e.message);
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

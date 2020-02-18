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
import { ConfigsService } from '../../../../../common/services/configs.service';
import localLabels from './local-labels';

@Component({
  selector: 'm-walletCashBankForm',
  templateUrl: './cash-bank-form.component.html',
})
export class WalletCashBankFormComponent implements OnInit {
  @Input() allowedCountries: string[];
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
    protected walletService: WalletDashboardService,
    private fb: FormBuilder,
    private formToastService: FormToastService,
    private configs: ConfigsService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      country: ['', Validators.required],
      accountNumber: ['', Validators.required],
      routingNumber: ['', requiredFor(['US'])],
    });

    console.log('kk', this.account);

    this.initCountry = this.hasBankAccount()
      ? this.account.bankAccount.country
      : this.account.country;
    this.country.patchValue(this.initCountry);
    this.detectChanges();
  }

  // async getAccount() {
  //   this.inProgress = true;
  //   this.detectChanges();

  //   this.walletService
  //     .getStripeAccount()
  //     .then((account: any) => {
  //       this.account = account;
  //       this.initCountry = account.bankAccount.country || account.country;
  //       this.country.patchValue(this.initCountry);
  //     })
  //     .catch(e => {
  //       this.formToastService.error(e.message);
  //     });
  //   this.inProgress = false;
  //   this.detectChanges();
  // }
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

  async addBank() {
    this.error = '';
    this.walletService
      .addStripeBank(this.form.value)
      .then((response: any) => {
        this.editing = false;

        const toasterMessage = 'Your bank account has been successfully added';
        this.formToastService.success(toasterMessage);
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

  enterEditMode() {
    // TODOOJM see if this is necessary by checking what value country goes to after form.reset
    this.country.patchValue(this.initCountry);

    this.editing = true;
    this.detectChanges();
  }

  leaveEditMode() {
    this.showModal = false;
    this.editing = false;
    this.form.reset();
    this.detectChanges();
  }

  hasBankAccount() {
    if (this.account.requirement) {
      return this.account.requirement.indexOf('external_account') === -1;
    } else {
      return true;
    }
  }
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

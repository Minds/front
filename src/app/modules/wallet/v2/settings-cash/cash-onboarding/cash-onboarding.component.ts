import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { requiredFor, optionalFor } from './../settings-cash.validators';
import { WalletDashboardService } from '../../dashboard.service';
import { FormToastService } from '../../../../../common/services/form-toast.service';

@Component({
  selector: 'm-walletCashOnboarding',
  templateUrl: './cash-onboarding.component.html',
})
export class WalletCashOnboardingComponent implements OnInit {
  @Input() allowedCountries: string[];
  @Input() account;
  @Output() submitted: EventEmitter<any> = new EventEmitter();
  form;
  user;

  inProgress: boolean = false;
  showModal: boolean = false;
  editing;
  error: string = '';

  constructor(
    private cd: ChangeDetectorRef,
    protected walletService: WalletDashboardService,
    private fb: FormBuilder,
    private formToastService: FormToastService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      country: ['US', Validators.required],

      firstName: ['', optionalFor(['JP'])],
      lastName: ['', optionalFor(['JP'])],
      gender: ['', requiredFor(['JP'])],
      dob: ['', Validators.required],
      phoneNumber: ['', requiredFor(['JP'])],
      ssn: ['', requiredFor(['US'])],
      personalIdNumber: ['', requiredFor(['CA', 'HK', 'SG'])],

      street: ['', optionalFor(['JP'])],
      city: ['', optionalFor(['JP', 'SG'])],
      state: ['', requiredFor(['AU', 'CA', 'IE', 'US'])],
      postCode: ['', optionalFor(['HK', 'IE', 'JP'])],
      stripeAgree: ['', Validators.required],
    });
    this.detectChanges();
  }

  async createAccount() {
    this.inProgress = true;
    this.error = '';

    this.walletService
      .createStripeAccount(this.form.value)
      .then((response: any) => {
        console.log('createAccount response', response);

        if (!this.user.programs) {
          this.user.programs = [];
        }
        this.user.programs.push('affiliate');

        this.user.merchant = {
          id: response.id,
          service: 'stripe',
        };
        this.detectChanges();
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
    this.editing = true;
    this.detectChanges();
  }
  leaveEditMode() {
    this.editing = false;
    this.form.reset();
    this.detectChanges();
  }

  isCountry(countries: string[]) {
    return countries.indexOf(this.country.value) > -1;
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  get country() {
    return this.form.get('country');
  }
  get firstName() {
    return this.form.get('firstName');
  }
  get lastName() {
    return this.form.get('lastName');
  }
  get gender() {
    return this.form.get('gender');
  }
  get dob() {
    return this.form.get('dob');
  }
  get phoneNumber() {
    return this.form.get('phoneNumber');
  }
  get ssn() {
    return this.form.get('ssn');
  }
  get personalIdNumber() {
    return this.form.get('personalIdNumber');
  }
  get street() {
    return this.form.get('street');
  }
  get city() {
    return this.form.get('city');
  }
  get state() {
    return this.form.get('state');
  }
  get postCode() {
    return this.form.get('postCode');
  }
  get stripeAgree() {
    return this.form.get('stripeAgree');
  }
}

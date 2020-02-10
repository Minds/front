import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Client } from '../../../services/api';

import { requiredFor, optionalFor } from './onboarding.validators';
import { Session } from '../../../services/session';

@Component({
  selector: 'm-monetization--onboarding',
  templateUrl: 'onboarding.component.html',
})
export class MonetizationOnboardingComponent implements OnInit {
  form: FormGroup;
  inProgress: boolean = false;
  restrictAsVerified: boolean = false;

  merchant: any;
  error: string;

  @Input() edit: boolean = false;

  @Output() completed: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    private client: Client,
    private cd: ChangeDetectorRef,
    private session: Session
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      country: ['', Validators.required],
      ssn: ['', requiredFor(['US'], { ignore: this.edit })],
      personalIdNumber: [
        '',
        requiredFor(['CA', 'HK', 'SG'], { ignore: this.edit }),
      ],
      firstName: ['', optionalFor(['JP'])],
      lastName: ['', optionalFor(['JP'])],
      gender: ['', requiredFor(['JP'])],
      dob: ['', Validators.required],
      street: ['', optionalFor(['JP'])],
      city: ['', optionalFor(['JP', 'SG'])],
      state: ['', requiredFor(['AU', 'CA', 'IE', 'US'])],
      postCode: ['', optionalFor(['HK', 'IE', 'JP'])],
      phoneNumber: ['', requiredFor(['JP'])],
      stripeAgree: ['', Validators.required],
    });

    this.restrictAsVerified = false;

    if (this.merchant) {
      if (this.edit) {
        this.merchant.stripeAgree = true;
        this.restrictAsVerified = this.merchant.verified;
      }

      this.form.patchValue(this.merchant);
    }

    this.disableRestrictedFields();
  }

  @Input('merchant') set _merchant(value) {
    if (!value) {
      return;
    }

    this.restrictAsVerified = false;

    if (this.form) {
      if (this.edit) {
        value.stripeAgree = true;
      }

      this.form.patchValue(value);
    }

    this.merchant = value;
    this.restrictAsVerified = this.merchant.verified;
    this.disableRestrictedFields();
  }

  submit() {
    if (!this.edit) {
      this.onboard();
    } else {
      this.update();
    }
  }

  onboard() {
    if (this.inProgress) {
      return;
    }

    this.inProgress = true;
    this.error = '';

    this.client
      .post('api/v1/merchant/onboard', this.form.value)
      .then((response: any) => {
        this.inProgress = false;

        if (!this.session.getLoggedInUser().programs)
          this.session.getLoggedInUser().programs = [];
        this.session.getLoggedInUser().programs.push('affiliate');

        this.completed.emit(response);
        this.detectChanges();
      })
      .catch(e => {
        this.inProgress = false;
        this.error = e.message;
        this.detectChanges();
      });
  }

  update() {
    if (this.inProgress) {
      return;
    }

    this.inProgress = true;
    this.error = '';

    this.client
      .post('api/v1/merchant/update', this.form.value)
      .then((response: any) => {
        this.inProgress = false;
        this.completed.emit(response);
        this.detectChanges();
      })
      .catch(e => {
        this.inProgress = false;
        this.error = e.message;
        this.detectChanges();
      });
  }

  disableRestrictedFields() {
    if (!this.form) {
      return;
    }

    const action = this.restrictAsVerified ? 'disable' : 'enable';

    this.form.controls.firstName[action]();
    this.form.controls.lastName[action]();
    this.form.controls.gender[action]();
    this.form.controls.dob[action]();
    this.form.controls.street[action]();
    this.form.controls.city[action]();
    this.form.controls.state[action]();
    this.form.controls.postCode[action]();
    this.form.controls.phoneNumber[action]();
  }

  isCountry(countries: string[]) {
    const currentCountry = this.form.controls.country.value;
    return countries.indexOf(currentCountry) > -1;
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}

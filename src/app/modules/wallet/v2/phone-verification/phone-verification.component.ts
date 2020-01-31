import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import {
  FormBuilder,
  AbstractControl,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { Client } from '../../../../services/api';
import { Session } from '../../../../services/session';

@Component({
  selector: 'm-walletPhoneVerification',
  templateUrl: './phone-verification.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletPhoneVerificationComponent implements OnInit {
  inProgress = false;
  confirming = false;
  invalidNumber = false;
  invalidCode = false;

  form = this.fb.group({
    number: [''],
    code: [''],
    secret: [''],
  });

  @Output() phoneVerificationComplete: EventEmitter<any> = new EventEmitter();

  constructor(
    protected session: Session,
    private fb: FormBuilder,
    protected client: Client,
    protected cd: ChangeDetectorRef
  ) {}

  ngOnInit() {}

  async validateNumber() {
    this.invalidNumber = false;
    this.invalidCode = false;
    this.inProgress = true;
    this.detectChanges();

    try {
      const response: any = await this.client.post(
        'api/v2/blockchain/rewards/verify',
        {
          number: this.form.value.number,
        }
      );
      this.form.controls['secret'].setValue(response.secret);
      this.confirming = true;
    } catch (e) {
      this.invalidNumber = true;
      console.error(e.message);
    }
    this.inProgress = false;
    this.detectChanges();
  }

  async confirmCode() {
    this.invalidNumber = false;
    this.invalidCode = false;
    this.inProgress = true;
    this.detectChanges();
    try {
      const response: any = await this.client.post(
        'api/v2/blockchain/rewards/confirm',
        {
          number: this.form.value.number,
          code: this.form.value.code,
          secret: this.form.value.secret,
        }
      );
      window.Minds.user.rewards = true;
      this.phoneVerificationComplete.emit();
    } catch (e) {
      this.invalidCode = true;
    }

    this.inProgress = false;
    this.detectChanges();
  }

  changePhone() {
    this.form.reset();
    console.log(this.form.value);
    this.invalidNumber = false;
    this.invalidCode = false;
    this.confirming = false;
    this.detectChanges();
  }
  onSubmit() {
    this.confirming ? this.confirmCode() : this.validateNumber();
  }
  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}

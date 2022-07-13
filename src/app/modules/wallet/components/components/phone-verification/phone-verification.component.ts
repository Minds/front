import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewRef,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormToastService } from '../../../../../common/services/form-toast.service';
import { Client } from '../../../../../services/api';
import { Session } from '../../../../../services/session';

@Component({
  selector: 'm-walletPhoneVerification',
  templateUrl: './phone-verification.component.html',
  styleUrls: ['./phone-verification.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletPhoneVerificationComponent implements OnInit {
  /**
   * Completion intent
   */
  onComplete: (any) => any = () => {};

  /**
   * Dismiss intent
   */
  onDismissIntent: () => void = () => {};

  /**
   * Modal options
   *
   * @param onComplete
   * @param onDismissIntent
   */
  setModalData({ onComplete, onDismissIntent }) {
    this.onComplete = onComplete || (() => {});
    this.onDismissIntent = onDismissIntent || (() => {});
  }

  inProgress = false;
  confirming = false;
  invalidNumber = false;
  invalidCode = false;

  form = this.fb.group({
    number: [''],
    code: [''],
    secret: [''],
  });

  readonly userHasPhoneHash: boolean;

  @Output() phoneVerificationComplete: EventEmitter<any> = new EventEmitter();

  constructor(
    protected session: Session,
    private fb: FormBuilder,
    protected client: Client,
    protected cd: ChangeDetectorRef,
    private toast: FormToastService
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
      this.toast.error(e.message || e);
      if (e.type === 'InvalidPhoneException') {
        this.invalidNumber = true;
      }
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
      await this.client.post('api/v2/blockchain/rewards/confirm', {
        number: this.form.value.number,
        code: this.form.value.code,
        secret: this.form.value.secret,
      });
      this.phoneVerificationComplete.emit();
      this.onComplete(true);
    } catch (e) {
      this.invalidCode = true;
    }

    this.inProgress = false;
    this.detectChanges();
  }

  changePhone() {
    this.form.reset();
    this.invalidNumber = false;
    this.invalidCode = false;
    this.confirming = false;
    this.detectChanges();
  }

  onSubmit() {
    if (!this.inProgress) {
      this.confirming ? this.confirmCode() : this.validateNumber();
    }
  }
  detectChanges() {
    if (!(this.cd as ViewRef).destroyed) {
      this.cd.markForCheck();
      this.cd.detectChanges();
    }
  }
}

import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { FormToastService } from '../../../../common/services/form-toast.service';
import { Session } from '../../../../services/session';

type TokenOnboardingStep = 'phone' | 'address';
@Component({
  selector: 'm-walletTokenOnboarding',
  templateUrl: './token-onboarding.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletTokenOnboardingComponent {
  private _hasAddress: boolean;
  @Input() set hasAddress(value: boolean) {
    this._hasAddress = value;
    if (value) {
      this.addressSetupComplete();
    }
    this.detectChanges();
  }
  get hasAddress(): boolean {
    return this._hasAddress;
  }

  private _phoneVerified: boolean;
  @Input() set phoneVerified(value: boolean) {
    this._phoneVerified = value;
    if (value) {
      this.phoneVerificationComplete();
    }
    this.detectChanges();
  }
  get phoneVerified(): boolean {
    return this._phoneVerified;
  }

  showModal = false;
  activeStep: TokenOnboardingStep = 'phone';
  user;

  @Output() onboardingComplete: EventEmitter<any> = new EventEmitter();
  @Output() scrollToTokenSettings: EventEmitter<any> = new EventEmitter();

  constructor(
    protected cd: ChangeDetectorRef,
    private formToastService: FormToastService,
    protected session: Session
  ) {}

  clickedPhoneStep() {
    if (!this.phoneVerified) {
      this.activeStep = 'phone';
      this.showModal = true;
    }
    this.detectChanges();
  }

  clickedAddressStep() {
    if (!this.hasAddress) {
      this.activeStep = 'address';
      this.scrollToTokenSettings.emit();
    }
    this.detectChanges();
  }

  phoneVerificationComplete() {
    this._phoneVerified = true;
    this.session.getLoggedInUser().rewards = true;
    this.showModal = false;
    if (!this._hasAddress) {
      this.activeStep = 'address';
      this.detectChanges();
    } else {
      this.finishedOnboarding();
    }
  }

  addressSetupComplete() {
    this._hasAddress = true;
    this.session.getLoggedInUser().eth_wallet = true;
    this.showModal = false;
    if (!this._phoneVerified) {
      this.activeStep = 'phone';
      this.detectChanges();
    } else {
      this.finishedOnboarding();
    }
  }

  finishedOnboarding() {
    // this.formToastService.success(
    //   "You're ready to start earning token rewards!"
    // );
    this.onboardingComplete.emit();
    this.detectChanges();
  }
  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}

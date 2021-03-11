import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ElementRef,
} from '@angular/core';
import { take } from 'rxjs/operators';
import { AbstractSubscriberComponent } from '../../../../../common/components/abstract-subscriber/abstract-subscriber.component';
import { FormToastService } from '../../../../../common/services/form-toast.service';
import { Session } from '../../../../../services/session';
import { PhoneVerificationService } from '../../components/phone-verification/phone-verification.service';

type TokenOnboardingStep = 'phone' | 'address';
@Component({
  selector: 'm-walletTokenOnboarding',
  templateUrl: './token-onboarding.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletTokenOnboardingComponent extends AbstractSubscriberComponent {
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

  private _dashboardView: ElementRef;
  @Input() set dashboardView(value: ElementRef) {
    this._dashboardView = value;
  }
  get dashboardView(): ElementRef {
    return this._dashboardView;
  }

  activeStep: TokenOnboardingStep = 'phone';
  user;

  @Output() onboardingComplete: EventEmitter<any> = new EventEmitter();
  @Output() scrollToTokenSettings: EventEmitter<any> = new EventEmitter();

  constructor(
    protected cd: ChangeDetectorRef,
    private toasterService: FormToastService,
    private phoneVerificationService: PhoneVerificationService,
    protected session: Session
  ) {
    super();
  }

  /**
   * Fired on click to setup phone verification.
   * @returns { Promise<void> }
   */
  public async clickedPhoneStep(): Promise<void> {
    if (!this.phoneVerified) {
      const success = await this.phoneVerificationService.open();

      this.subscriptions.push(
        this.phoneVerificationService.phoneVerified$
          .pipe(take(1))
          .subscribe((verified: boolean) => {
            if (verified) {
              this.phoneVerificationComplete();
            }
          })
      );
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

    if (!this._phoneVerified) {
      this.activeStep = 'phone';
      this.detectChanges();
    } else {
      this.finishedOnboarding();
    }
  }

  scrollToElement() {
    this._dashboardView.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  finishedOnboarding() {
    // this.toasterService.success(
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

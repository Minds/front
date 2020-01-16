import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Session } from '../../../../services/session';
import { FormToastService } from '../../../../common/services/form-toast.service';

@Component({
  selector: 'm-walletTokenOnboarding',
  templateUrl: './token-onboarding.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletTokenOnboardingComponent implements OnInit {
  phoneVerified = false;
  addressAdded = false;
  showModal = false;
  activeStep = 'phone'; // || address

  @Output() onboardingComplete: EventEmitter<any> = new EventEmitter();
  @Output() scrollToTokenSettings: EventEmitter<any> = new EventEmitter();

  constructor(
    protected session: Session,
    protected cd: ChangeDetectorRef,
    private formToastService: FormToastService,
    protected router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.phoneVerified = this.session.getLoggedInUser().rewards;
    this.addressAdded = this.session.getLoggedInUser().eth_wallet;
    if (this.phoneVerified && this.addressAdded) {
      this.onboardingComplete.emit();
    }
    this.detectChanges();
  }

  clickedPhoneStep() {
    if (!this.phoneVerified) {
      this.activeStep = 'phone';
      this.showModal = true;
    }
    this.detectChanges();
  }

  clickedAddressStep() {
    if (!this.addressAdded) {
      this.activeStep = 'address';
      this.scrollToTokenSettings.emit();
    }
    this.detectChanges();
  }

  phoneVerificationComplete() {
    this.phoneVerified = true;
    this.showModal = false;
    this.formToastService.success('Your phone number has been verified');
    if (!this.addressAdded) {
      this.activeStep = 'address';
    } else {
      this.onboardingComplete.emit();
    }
  }

  addressSetupComplete() {
    this.addressAdded = true;
    this.showModal = false;
    if (!this.phoneVerified) {
      this.activeStep = 'phone';
    } else {
      this.onboardingComplete.emit();
    }
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}

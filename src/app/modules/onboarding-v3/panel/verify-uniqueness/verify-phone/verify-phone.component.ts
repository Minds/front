import { Component } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { scan, takeWhile } from 'rxjs/operators';
import {
  OnboardingV3VerifyPhoneService,
  PhoneVerificationStep,
} from './verify-phone.service';

/**
 * Verify phone component for onboarding v3
 */
@Component({
  selector: 'm-onboardingV3__phone',
  templateUrl: './verify-phone.component.html',
  styleUrls: ['./verify-phone.component.ng.scss'],
})
export class OnboardingV3VerifyPhoneComponent {
  /**
   * Holds an observable of a retry countdown.
   */
  public retryTimer$: Observable<number>;

  /**
   * FormGroup object
   */
  public form = this.fb.group({
    number: [''],
    code: [''],
    secret: [''],
    friendFinding: [''],
  });

  constructor(
    private fb: UntypedFormBuilder,
    private service: OnboardingV3VerifyPhoneService
  ) {}

  /**
   * Get inProgress$ from service.
   * @returns { Observable<boolean> } - true if in progress.
   */
  get inProgress$(): Observable<boolean> {
    return this.service.inProgress$;
  }

  /**
   * Get current PhoneVerificationStep from service.
   * @returns { BehaviorSubject<PhoneVerificationStep> } - current step.
   */
  get verificationStep$(): BehaviorSubject<PhoneVerificationStep> {
    return this.service.verificationStep$;
  }

  /**
   * Called on send pressed. Calls send-code in service
   * and starts retry timer.
   * @returns { void }
   */
  public onSend(): void {
    this.service.sendCode(this.form.get('number').value);
    this.startRetryTimer();
  }

  /**
   * Called on code submission. Calls verify code in service.
   * @returns { void }
   */
  public onCodeSubmit(): void {
    this.service.verifyCode(
      this.form.get('number').value,
      this.form.get('code').value
    );
  }

  /**
   * On change number click, change step to InputNumberStep
   * @returns { void }
   */
  public onChangeNumberClick(): void {
    this.verificationStep$.next('InputNumberStep');
  }

  /**
   * Starts observable countdown held by the class member retryTimer$
   * @param { number } - amount of seconds to countdown from - defaults to 30.
   * @returns { void }
   */
  private startRetryTimer(seconds: number = 30): void {
    this.retryTimer$ = timer(0, 1000).pipe(
      scan(acc => --acc, seconds),
      takeWhile(x => x >= 0)
    );
  }
}

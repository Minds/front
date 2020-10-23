import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { exit } from 'process';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  Subscription,
  timer,
} from 'rxjs';
import { map, scan, take, takeWhile, tap } from 'rxjs/operators';
import { FormToastService } from '../../../../../common/services/form-toast.service';
import { StepName } from '../../../onboarding-v3.service';
import { OnboardingV3PanelService } from '../../onboarding-panel.service';
import {
  OnboardingV3VerifyPhoneService,
  PhoneVerificationStep,
} from './verify-phone.service';

@Component({
  selector: 'm-onboardingV3__phone',
  templateUrl: './verify-phone.component.html',
  styleUrls: ['./verify-phone.component.ng.scss'],
  providers: [],
})
export class OnboardingV3VerifyPhoneComponent implements OnDestroy {
  private subscriptions: Subscription[] = [];
  public retryTimer$: Observable<number>;

  form = this.fb.group({
    number: [''],
    code: [''],
    secret: [''],
    friendFinding: [''],
  });

  constructor(
    private fb: FormBuilder,
    private service: OnboardingV3VerifyPhoneService
  ) {}

  get inProgress$(): Observable<boolean> {
    return this.service.inProgress$;
  }

  get verificationStep$(): BehaviorSubject<PhoneVerificationStep> {
    return this.service.verificationStep$;
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  public onSend() {
    this.service.sendCode(this.form.get('number').value);
    this.startRetryTimer();
  }

  public onCodeSubmit() {
    this.service.verifyCode(
      this.form.get('number').value,
      this.form.get('code').value
    );
  }

  public onChangeNumberClick() {
    this.verificationStep$.next('InputNumberStep');
  }

  // get canResend$(): Observable<boolean> {
  //   return this.retryTimer$.pipe(
  //     map(timer => timer < 1)
  //   )
  // }

  private startRetryTimer(seconds: number = 30) {
    this.retryTimer$ = timer(0, 1000).pipe(
      scan(acc => --acc, seconds),
      takeWhile(x => x >= 0)
    );
  }
}

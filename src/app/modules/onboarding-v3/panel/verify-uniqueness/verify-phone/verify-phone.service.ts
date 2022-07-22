import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { ApiService } from '../../../../../common/api/api.service';
import { ToasterService } from '../../../../../common/services/toaster.service';
import { OnboardingV3PanelService } from '../../onboarding-panel.service';

export type PhoneVerificationStep = 'InputNumberStep' | 'ConfirmCodeStep';

/**
 * Phone verification service for onboarding v3.
 */
@Injectable({ providedIn: 'root' })
export class OnboardingV3VerifyPhoneService implements OnDestroy {
  private subscriptions: Subscription[] = [];

  /**
   * BehaviourSubject holding the current PhoneVerificationStep.
   */
  public readonly verificationStep$: BehaviorSubject<
    PhoneVerificationStep
  > = new BehaviorSubject<PhoneVerificationStep>('InputNumberStep');

  /**
   * BehaviourSubject holding whether loading is in progress
   */
  public readonly inProgress$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  /**
   * BehaviourSubject holding the secret value passed to the front-end
   * by the api/v2/blockchain/rewards/verify call.
   */
  private readonly secret$: BehaviorSubject<string> = new BehaviorSubject<
    string
  >('');

  constructor(
    private panel: OnboardingV3PanelService,
    private toast: ToasterService,
    private api: ApiService
  ) {}

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  /**
   * Send a code to a given phone number.
   * @param { number } phoneNumber - phone number in numerical form.
   * @returns { void }
   */
  public sendCode(phoneNumber: number): void {
    this.inProgress$.next(true);
    this.subscriptions.push(
      this.api
        .post('api/v2/blockchain/rewards/verify', { number: phoneNumber })
        .pipe(
          take(1),
          catchError(e => this.handleError(e))
        )
        .subscribe((response: any) => {
          if (!response) {
            return;
          }

          this.secret$.next(response.secret);
          this.verificationStep$.next('ConfirmCodeStep');
          this.inProgress$.next(false);
        })
    );
  }

  /**
   * Send a verification code to the server and handle response.
   * @param { number } - receiving phone number.
   * @param { string } - verification code.
   * @returns { void }
   */
  public verifyCode(phoneNumber: number, code: string): void {
    this.inProgress$.next(true);

    this.subscriptions.push(
      this.api
        .post('api/v2/blockchain/rewards/confirm', {
          number: phoneNumber,
          code: code,
          secret: this.secret$.getValue(),
        })
        .pipe(
          take(1),
          catchError(e => this.handleError(e))
        )
        .subscribe((response: any) => {
          if (!response) {
            return;
          }

          this.inProgress$.next(false);
          this.toast.success('Verification successful');
          this.panel.forceComplete$.next('VerifyUniquenessStep');
          this.panel.dismiss$.next(true);
        })
    );
  }

  /**
   * Handle an error, display message from server or generic error
   * as a toast.
   * @param { message? } e - error
   * @returns Observable<null> - returns of null for use in rxjs pipes.
   */
  private handleError(e: { message? }): Observable<null> {
    this.inProgress$.next(false);
    this.toast.error(e.message ? e.message : 'An unknown error has occurred');
    return of(null);
  }
}

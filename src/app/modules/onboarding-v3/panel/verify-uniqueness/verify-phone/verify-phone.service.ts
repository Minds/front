import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { ApiService } from '../../../../../common/api/api.service';
import { FormToastService } from '../../../../../common/services/form-toast.service';
import { OnboardingV3PanelService } from '../../onboarding-panel.service';

export type PhoneVerificationStep = 'InputNumberStep' | 'ConfirmCodeStep';

@Injectable({ providedIn: 'root' })
export class OnboardingV3VerifyPhoneService implements OnDestroy {
  private subscriptions: Subscription[] = [];

  public readonly verificationStep$: BehaviorSubject<
    PhoneVerificationStep
  > = new BehaviorSubject<PhoneVerificationStep>('InputNumberStep');

  public readonly inProgress$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  public readonly secret$: BehaviorSubject<string> = new BehaviorSubject<
    string
  >('');

  constructor(
    private panel: OnboardingV3PanelService,
    private toast: FormToastService,
    private api: ApiService
  ) {}

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

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

  public verifyCode(phoneNumber: number, code: string) {
    this.inProgress$.next(true);

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
          this.toast.success('An error has occurred');
          return;
        }

        this.inProgress$.next(false);
        this.toast.success('Verification successful');
        this.panel.nextStep();
      });
  }

  private handleError(e): Observable<null> {
    this.inProgress$.next(false);
    this.toast.error(e.message ? e.message : 'An unknown error has occured');
    return of(null);
  }
}

import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, EMPTY, Observable, of, Subscription } from 'rxjs';
import { catchError, map, switchMap, take, throttleTime } from 'rxjs/operators';
import { ApiService } from '../../../../common/api/api.service';
import { FormToastService } from '../../../../common/services/form-toast.service';
import { MindsUser } from '../../../../interfaces/entities';

/**
 * Credentials payload
 */
export type CredentialsPayload = { username: string; password: string };

/**
 * Response from authenticate endpoint
 */
export type AuthResponse = { status: string; user: MindsUser };

/**
 * Object containing data needed to construct payload.
 */
export type MFARequest = {
  secretKeyId?: string;
  username: string;
  password: string;
};

/**
 * Modal entry-points.
 */
export type MultiFactorRootPanel = 'sms' | 'totp';

/**
 * Different panels that can be displayed.
 */
export type MultiFactorPanel =
  | MultiFactorRootPanel
  | 'totp-code'
  | 'totp-recovery'
  | '';

/**
 * Service for Multi-factor authentication.
 * Handles shared state.
 */
@Injectable({ providedIn: 'root' })
export class MultiFactorAuthService implements OnDestroy {
  protected subscriptions: Subscription[] = [];

  /**
   * Currently active panel.
   */
  public readonly activePanel$: BehaviorSubject<
    MultiFactorPanel
  > = new BehaviorSubject<MultiFactorPanel>('totp');

  /**
   * Code from form.
   */
  public readonly code$: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
  );

  /**
   * Fired on success.
   */
  public readonly onSuccess$: BehaviorSubject<MindsUser> = new BehaviorSubject<
    MindsUser
  >(null);

  /**
   * Fired on success.
   */
  public readonly inProgress$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(null);

  /**
   * MFA Request payload
   */
  private readonly mfaRequest$: BehaviorSubject<
    MFARequest
  > = new BehaviorSubject<MFARequest>(null);

  constructor(
    private toast: FormToastService,
    private api: ApiService,
    private router: Router
  ) {}

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  /**
   * Set MFA request object.
   * @param { MFARequest } mfaRequest
   * @returns { MultiFactorAuthService } - Chainable.
   */
  public setMFARequest(mfaRequest: MFARequest): MultiFactorAuthService {
    this.mfaRequest$.next(mfaRequest);
    return this;
  }

  /**
   * Call to validate code.
   * @param { string } code - code for submission.
   * @returns { void }
   */
  public validateCode(code: string): void {
    this.inProgress$.next(true);
    this.subscriptions.push(
      this.mfaRequest$
        .pipe(
          take(1),
          throttleTime(2000),
          // shape data we need from MFARequest
          map(
            (mfaRequest: MFARequest): CredentialsPayload => {
              return {
                username: mfaRequest.username,
                password: mfaRequest.password,
              };
            }
          ),
          // emit api post observable using previously mapped data.
          switchMap((data: CredentialsPayload) => {
            return this.api.post('api/v1/authenticate', data, {
              headers: { 'X-MINDS-2FA-CODE': code },
            });
          }),
          catchError(e => this.handleError(e))
        )
        .subscribe((response: AuthResponse) => {
          this.inProgress$.next(false);
          if (!response) {
            return;
          }
          this.onSuccess$.next(response.user);
        })
    );
  }

  /**
   * Call to validate code.
   * @param { string } code - code for submission.
   * @returns { void }
   */
  public validateRecoveryCode(code: string): void {
    this.inProgress$.next(true);
    this.subscriptions.push(
      this.mfaRequest$
        .pipe(
          take(1),
          throttleTime(2000),
          switchMap((mfaRequest: MFARequest): any => {
            return this.api.post('api/v3/security/totp/recovery', {
              username: mfaRequest.username,
              password: mfaRequest.password,
              recovery_code: code,
            });
          }),
          catchError(e => this.handleError(e))
        )
        .subscribe((response: any): void => {
          this.inProgress$.next(false);

          if (!response) {
            return;
          }

          if (!response.matches) {
            this.toast.error('Invalid recovery code');
            return;
          }

          this.toast.success('Successfully recovered MFA. Please login again.');
          this.router.navigate(['/']);
        })
    );
  }

  /**
   * Call to validate code.
   * @param { string } code - code for submission.
   * @returns { void }
   */
  public validateSMSCode(code: string): void {
    this.inProgress$.next(true);
    this.subscriptions.push(
      this.mfaRequest$
        .pipe(
          take(1),
          throttleTime(2000),
          // shape MFARequest into the shape we need
          map((mfaRequest: MFARequest): any => {
            return {
              username: mfaRequest.username,
              password: mfaRequest.password,
              secretKeyId: mfaRequest.secretKeyId,
            };
          }),
          // construct and emit api post request
          switchMap((args: MFARequest) => {
            const data = {
              username: args.username,
              password: args.password,
            };
            return this.api.post('api/v1/authenticate', data, {
              headers: {
                'X-MINDS-2FA-CODE': code,
                'X-MINDS-SMS-2FA-KEY': args.secretKeyId,
              },
            });
          }),
          catchError(e => this.handleError(e))
        )
        .subscribe((response: AuthResponse) => {
          this.inProgress$.next(false);

          if (!response) {
            return;
          }
          this.onSuccess$.next(response.user);
        })
    );
  }

  /**
   * Resend an SMS code and replace secret.
   * @returns { void }
   */
  public resendSMS(): void {
    this.subscriptions.push(
      this.mfaRequest$
        .pipe(
          take(1),
          throttleTime(30000),
          // shape MFARequest into the shape we need
          map(
            (mfaRequest: MFARequest): CredentialsPayload => {
              return {
                username: mfaRequest.username,
                password: mfaRequest.password,
              };
            }
          ),
          // construct and emit api post request.
          switchMap((data: CredentialsPayload) => {
            return this.api.post('api/v1/authenticate', data);
          }),
          catchError(e => {
            // we are expecting this error
            if (
              e.error.errorId ===
              'Minds::Core::Security::TwoFactor::TwoFactorRequiredException'
            ) {
              // get new key from header to pass through with validation request
              const smsKey = e.headers.get('X-MINDS-SMS-2FA-KEY');

              // setup next panel and update MFARequest.
              this.activePanel$.next(smsKey ? 'sms' : 'totp');
              this.setMFARequest({
                ...this.mfaRequest$.getValue(),
                secretKeyId: smsKey ?? null,
              });
              this.toast.success('Your code has been resent.');
              return EMPTY;
            }
            // else, handle like other errors.
            return this.handleError(e);
          })
        )
        .subscribe((response: AuthResponse) => {
          if (!response) {
            return;
          }
        })
    );
  }

  /**
   * Handles errors
   * @returns { Observable<null> }
   */
  private handleError(e: { error }): Observable<boolean> {
    this.toast.error(e.error.message ?? `An unknown error has occurred`);
    return of(null);
  }
}

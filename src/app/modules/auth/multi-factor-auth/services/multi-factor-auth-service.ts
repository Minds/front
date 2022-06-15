import { HttpRequest } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { BehaviorSubject, EMPTY, Observable, of, Subscription } from 'rxjs';
import { last } from 'rxjs/operators';
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
export type MFAPayload = {
  smsSecretKey?: string;
  emailSecretKey?: string;
  code?: string;
};

/**
 * Modal entry-points.
 */
export type MultiFactorRootPanel = 'sms' | 'totp' | 'email';

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
export class MultiFactorAuthService {
  /**
   * Currently active panel.
   */
  public readonly activePanel$: BehaviorSubject<
    MultiFactorPanel
  > = new BehaviorSubject<MultiFactorPanel>('totp');

  /**
   * Fired on success.
   */
  public readonly inProgress$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(null);

  /**
   * This is the original request that triggered the modal
   * Mainly used for recovery reset as we need the users credentials
   */
  public readonly originalRequest$: BehaviorSubject<
    HttpRequest<any>
  > = new BehaviorSubject<HttpRequest<any>>(null);

  /**
   * The type of 2fa being used
   * This determines how the payload is build
   */
  public readonly mfaType$: BehaviorSubject<
    MultiFactorRootPanel
  > = new BehaviorSubject<MultiFactorRootPanel>(null);

  /**
   * Email and SMS contain a a secret key with the request
   * Devices do not so should set to null
   */
  public readonly mfaSecretKey$: BehaviorSubject<
    string | null
  > = new BehaviorSubject<string | null>(null);

  /**
   * MFA Request payload for new request (interceptor will merge)
   */
  public readonly mfaPayload$: Subject<MFAPayload> = new Subject<MFAPayload>();

  constructor(
    private toast: FormToastService,
    private api: ApiService,
    private router: Router
  ) {}

  /**
   * Call to validate code.
   * @param { string } code - code for submission.
   * @returns { void }
   */
  public completeMultiFactor(code?: string): void {
    // It is the HTTP interceptor that handles the logic, so we just return
    // a mfaPayload object

    const payload: MFAPayload = {
      code,
    };

    if (this.mfaType$.getValue() === 'sms') {
      payload.smsSecretKey = this.mfaSecretKey$.getValue();
    } else if (this.mfaType$.getValue() === 'email') {
      payload.emailSecretKey = this.mfaSecretKey$.getValue();
    }

    this.inProgress$.next(Boolean(code)); // only get into inProgress if we're submitting, not resending
    this.mfaPayload$.next(payload);
  }

  /**
   * Call to validate code.
   * @param { string } code - code for submission.
   * @returns { void }
   */
  public async validateRecoveryCode(code: string): Promise<void> {
    this.inProgress$.next(true);

    const req: HttpRequest<any> = this.originalRequest$.getValue();

    const response = await this.api
      .post('api/v3/security/totp/recovery', {
        ...JSON.parse(req.body),
        recovery_code: code,
      })
      .toPromise();

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
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { EmailConfirmationService } from '../components/email-confirmation/email-confirmation.service';
import { FormToastService } from './form-toast.service';

/**
 * Allows a member to attempt to resend a confirmation email.
 * Stores timestamp of when user is next allowed in local storage
 * so that the thread being blocked doesn't impact the countdown.
 */
@Injectable({ providedIn: 'root' })
export class EmailResendService {
  // polls retryInSeconds for value updates.
  public readonly retryTimer$: Observable<number> = interval(1000).pipe(
    // map to seconds left till member can retry sending an email.
    map(i => this.retryInSeconds),
    // filter out values less than or equal to 0.
    filter(i => i >= 0),
    // set in progress to false.
    tap(i => this.inProgress$.next(false))
  );

  // is in progress.
  public readonly inProgress$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  constructor(
    protected service: EmailConfirmationService,
    protected toast: FormToastService
  ) {}

  /**
   * Checks timer and sends request if member is allowed to make another request.
   * @param { number } seconds - defaults to 60.
   * @returns { Promise<void> }
   */
  async send(seconds: number = 60): Promise<void> {
    if (!(this.retryInSeconds > 0)) {
      this.inProgress$.next(true);

      // await request to send email.
      try {
        let sent = await this.service.send();

        if (!sent) {
          throw new Error('Failed to send email.');
        }
      } catch (e) {
        console.error(e);
        this.toast.error(
          e.message ?? 'An error has occurred sending your email.'
        );
        this.inProgress$.next(false);
        return;
      }

      // create new date x seconds ahead of now.
      let time = new Date();
      time.setSeconds(time.getSeconds() + seconds);

      // set time in local storage.
      localStorage.setItem('email_resend', time.getTime().toString());

      // show success toast.
      this.toast.success(
        'Email sent, check your inbox for a verification email.'
      );
      return;
    }

    this.toast.inform(
      'Please wait ' +
        this.retryInSeconds +
        ' seconds before sending another email.'
    );
  }

  /**
   * When can a member resend an email.
   * @returns { number } - timestamp of when a member can retry.
   */
  get canResendTimestamp(): number {
    return parseInt(localStorage.getItem('email_resend')) ?? 0;
  }

  /**
   * How long till a member can retry, in seconds.
   * @returns { number } - how long to wait in seconds.
   */
  get retryInSeconds(): number {
    return (
      Math.floor((this.canResendTimestamp - new Date().getTime()) / 1000) ?? 0
    );
  }
}

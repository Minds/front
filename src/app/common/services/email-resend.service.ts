import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Observable } from 'rxjs';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import { EmailConfirmationService } from '../components/email-confirmation/email-confirmation.service';
import { ToasterService } from './toaster.service';

/**
 * Allows a member to attempt to resend a confirmation email.
 * Stores timestamp of when user is next allowed in local storage
 * so that the thread being blocked doesn't impact the countdown.
 */
@Injectable({ providedIn: 'root' })
export class EmailResendService {
  // is in progress.
  public readonly inProgress$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  // polls retryInSeconds for value updates.
  public readonly retryTimer$: Observable<number> = interval(1000).pipe(
    // map to seconds left till member can retry sending an email.
    // if less than 0 seconds, map to 0 seconds.
    map((i) => (this.retryInSeconds > 0 ? this.retryInSeconds : 0)),
    // do not emit further if the value is NOT different from the last value.
    // stops timer +-0-0-0-0-> emissions from triggering inProgress changes.
    distinctUntilChanged(),
    // set in progress to false.
    tap((i) => {
      this.inProgress$.next(false);
    })
  );

  constructor(
    protected service: EmailConfirmationService,
    protected toast: ToasterService
  ) {}

  /**
   * Checks timer and sends request if member is allowed to make another request.
   * @param { number } seconds - defaults to 60.
   * @returns { Promise<boolean> } - true if success, else false.
   */
  async send(seconds: number = 60): Promise<boolean> {
    if (this.inProgress$.getValue()) {
      this.toast.warn('Email send already in progress.');
      return false;
    }

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
        return false;
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

      this.inProgress$.next(false);
      return true;
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

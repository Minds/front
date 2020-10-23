import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';

import { EmailConfirmationService } from './email-confirmation.service';
import { Session } from '../../../services/session';
import { BehaviorSubject, Observable, Subscription, timer } from 'rxjs';
import { ConfigsService } from '../../services/configs.service';
import { Location } from '@angular/common';
import { scan, takeWhile } from 'rxjs/operators';
import { FormToastService } from '../../services/form-toast.service';

/**
 * Component that displays an announcement-like banner
 * asking the user to confirm their email address and a link
 * to re-send the confirmation email.
 * @see AnnouncementComponent
 */
@Component({
  selector: 'm-emailConfirmation',
  templateUrl: 'email-confirmation.component.html',
  styleUrls: ['email-confirmation.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailConfirmationComponent implements OnInit, OnDestroy {
  private readonly fromEmailConfirmation: number;
  public sent: boolean = false;
  public shouldShow: boolean = false;
  public retryTimer$: Observable<number> = new BehaviorSubject<number>(0);

  protected userEmitter$: Subscription;

  constructor(
    protected service: EmailConfirmationService,
    protected session: Session,
    protected cd: ChangeDetectorRef,
    protected location: Location,
    protected toast: FormToastService,
    configs: ConfigsService
  ) {
    this.fromEmailConfirmation = configs.get('from_email_confirmation');
  }

  ngOnInit(): void {
    this.setShouldShow(this.session.getLoggedInUser());

    // subscribe to user changes
    this.userEmitter$ = this.session.userEmitter.subscribe(user => {
      this.sent = false;
      this.setShouldShow(user);
      this.detectChanges();
    });
  }

  ngOnDestroy(): void {
    if (this.userEmitter$) {
      this.userEmitter$.unsubscribe();
    }
  }

  /**
   * Re-calculates the visibility of the banner
   * @param {Object} user
   */
  setShouldShow(user): void {
    this.shouldShow =
      !(this.location.path().indexOf('/onboarding') === 0) &&
      !this.fromEmailConfirmation &&
      user &&
      user.email_confirmed === false;
  }

  /**
   * Uses the service to re-send the confirmation email
   */
  async send(): Promise<void> {
    this.sent = true;
    this.startRetryCountdown();
    this.detectChanges();

    try {
      const sent = await this.service.send();

      if (!sent) {
        this.toast.error(
          'There was an issue sending the email to your email address.'
        );
        this.sent = false;
      } else {
        this.toast.success('Verification email sent to your email address.');
      }
    } catch (e) {
      this.toast.error(
        'An unknown error occurred sending the email to your email address.'
      );
    }

    this.detectChanges();
  }

  /**
   * Starts retry timer, which counts down to 0.
   * @param { number } - seconds to countdown - defaults to 30.
   * @returns { void }
   */
  private startRetryCountdown(seconds: number = 30): void {
    this.retryTimer$ = timer(0, 1000).pipe(
      scan(acc => --acc, seconds),
      takeWhile(x => x >= 0)
    );
  }

  detectChanges(): void {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}

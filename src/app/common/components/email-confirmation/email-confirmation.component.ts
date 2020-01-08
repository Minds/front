import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { EmailConfirmationService } from './email-confirmation.service';
import { Session } from '../../../services/session';
import { Subscription } from 'rxjs';

/**
 * Component that displays an announcement-like banner
 * asking the user to confirm their email address and a link
 * to re-send the confirmation email.
 * @see AnnouncementComponent
 */
@Component({
  providers: [EmailConfirmationService],
  selector: 'm-emailConfirmation',
  templateUrl: 'email-confirmation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailConfirmationComponent implements OnInit, OnDestroy {
  sent: boolean = false;
  shouldShow: boolean = false;
  canClose: boolean = false;

  protected userEmitter$: Subscription;
  protected canCloseTimer: number;
  protected minds = window.Minds;

  constructor(
    protected service: EmailConfirmationService,
    protected session: Session,
    protected cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.setShouldShow(this.session.getLoggedInUser());

    this.userEmitter$ = this.session.userEmitter.subscribe(user => {
      this.sent = false;
      this.setShouldShow(user);

      this.detectChanges();
    });

    this.canCloseTimer = window.setTimeout(() => {
      this.canClose = true;
      this.detectChanges();
    }, 3000);
  }

  ngOnDestroy(): void {
    window.clearTimeout(this.canCloseTimer);

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
      !this.minds.from_email_confirmation &&
      user &&
      user.email_confirmed === false;
  }

  /**
   * Uses the service to re-send the confirmation email
   */
  async send(): Promise<void> {
    this.sent = true;
    this.detectChanges();

    try {
      const sent = await this.service.send();

      if (!sent) {
        this.sent = false;
      }
    } catch (e) {}

    this.detectChanges();
  }

  detectChanges(): void {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}

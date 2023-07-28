import { Component, Input } from '@angular/core';
import { EmailConfirmationService } from '../../../../common/components/email-confirmation/email-confirmation.service';
import { EmailResendService } from '../../../../common/services/email-resend.service';
import { FeedNoticeService } from '../../services/feed-notice.service';

/**
 * Verify email notice - will stick to top of feed.
 */
@Component({
  selector: 'm-feedNotice--verifyEmail',
  templateUrl: 'verify-email-notice.component.html',
})
export class VerifyEmailNoticeComponent {
  @Input() public dismissible: boolean = false;

  constructor(
    protected emailResend: EmailResendService,
    private feedNotice: FeedNoticeService,
    private emailConfirmation: EmailConfirmationService
  ) {}

  /**
   * Called on primary option click.
   * @param { MouseEvent } $event - click event.
   * @return { void }
   */
  public onPrimaryOptionClick($event: MouseEvent): void {
    this.emailConfirmation.confirm();
  }

  /**
   * Dismiss notice.
   * @return { void }
   */
  public dismiss(): void {
    this.feedNotice.dismiss('verify-email');
  }
}

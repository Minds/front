import { Component } from '@angular/core';
import { EmailConfirmationService } from '../../../../common/components/email-confirmation/email-confirmation.service';
import { EmailResendService } from '../../../../common/services/email-resend.service';
import { ExperimentsService } from '../../../experiments/experiments.service';

/**
 * Verify email notice - will stick to top of feed.
 */
@Component({
  selector: 'm-feedNotice--verifyEmail',
  templateUrl: 'verify-email-notice.component.html',
})
export class VerifyEmailNoticeComponent {
  constructor(
    protected emailResend: EmailResendService,
    private emailConfirmation: EmailConfirmationService,
    private experiments: ExperimentsService
  ) {}

  /**
   * Called on primary option click.
   * @param { MouseEvent } $event - click event.
   * @return { void }
   */
  public onPrimaryOptionClick($event: MouseEvent): void {
    if (this.isEmailCodeExperimentActive()) {
      this.emailConfirmation.verify();
      return;
    }
    this.emailResend.send();
  }

  /**
   * Whether confirmation code experiment is active.
   * @returns { boolean } - true if email confirmation code experiment is active.
   */
  public isEmailCodeExperimentActive(): boolean {
    return this.experiments.hasVariation('minds-3055-email-codes', true);
  }
}

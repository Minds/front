import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Session } from '../../../../../../services/session';
import { Boost } from '../../../../boost.types';
import { BoostConsoleService } from '../../../services/console.service';

/**
 * Boost console list item action buttons
 */
@Component({
  selector: 'm-boostConsole__actionButtons',
  templateUrl: './action-buttons.component.html',
  styleUrls: ['./action-buttons.component.ng.scss'],
})
export class BoostConsoleActionButtonsComponent {
  /** @var { Boost } boost - Boost object */
  @Input() boost: Boost = null;

  // /**
  //  * The api state (button loading states)
  //  */
  // ojm
  // public readonly inProgress$$: BehaviorSubject<boolean> = this
  //   .boostReplyService.inProgress$$;

  constructor(
    private session: Session,
    private router: Router,
    private service: BoostConsoleService
  ) {}

  /**
   * Called upon approve button being clicked by admin.
   * @param { MouseEvent } e - mouse event.
   * @returns { Promise<void> }
   */
  async onApprove(e: MouseEvent): Promise<void> {
    this.service.approve(this.boost);
  }

  /**
   * Called upon reject button being clicked by admin.
   * @param { MouseEvent } e - mouse event.
   * @returns { void }
   */
  public onDecline(e: MouseEvent): void {
    this.supermindReplyService.decline(this.supermind);
  }

  /**
   * Called upon cancel button being clicked.
   * @param { MouseEvent } e - mouse event.
   * @returns { void }
   */
  public onCancel(e: MouseEvent): void {
    this.supermindReplyService.cancel(this.supermind);
  }

  /**
   * Called upon view reply button being clicked.
   * @param { MouseEvent } e - mouse event.
   * @returns { void }
   */
  public onViewReply(e: MouseEvent): void {
    this.router.navigate([`/newsfeed/${this.supermind.reply_activity_guid}`]);
  }

  /**
   * Whether accept and decline buttons should be shown.
   * @returns { boolean } true if accept and decline buttons should be shown.
   */
  public shouldShowAcceptAndDeclineButtons(): boolean {
    return (
      this.supermind.status === SupermindState.CREATED &&
      !this.hasExpired() &&
      this.supermind.receiver_guid === this.session.getLoggedInUser().guid
    );
  }

  /**
   * Whether View Reply button should be shown.
   * @returns { boolean } true if View Reply button should be shown.
   */
  public shouldShowViewReplyButton(): boolean {
    return (
      (this.supermind.status === SupermindState.ACCEPTED ||
        this.supermind.status === SupermindState.TRANSFER_FAILED) &&
      Boolean(this.supermind.reply_activity_guid)
    );
  }

  /**
   * Whether Supermind has expired - useful if server hasn't yet updated state but timer has ran out.
   * @returns { boolean } true if Supermind has expired.
   */
  private hasExpired(): boolean {
    return !this.expirationService.getTimeTillExpiration(this.supermind);
  }
}

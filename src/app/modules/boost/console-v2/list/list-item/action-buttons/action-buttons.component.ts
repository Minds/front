import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Session } from '../../../../../../services/session';
import { Boost, BoostState } from '../../../../boost.types';
import { BoostConsoleService } from '../../../services/console.service';

/**
 * Boost console list item action buttons
 * Actions can only be taken on pending boosts
 */
@Component({
  selector: 'm-boostConsole__actionButtons',
  templateUrl: './action-buttons.component.html',
  styleUrls: ['./action-buttons.component.ng.scss'],
})
export class BoostConsoleActionButtonsComponent {
  /** @var { Boost } boost - Boost object */
  @Input() boost: Boost = null;

  /**
   * Button loading states
   */
  approving: boolean = false;
  rejecting: boolean = false;
  cancelling: boolean = false;

  constructor(private session: Session, public service: BoostConsoleService) {}

  /**
   * Called upon approve button being clicked by admin.
   * @param { MouseEvent } e - mouse event.
   * @returns { Promise<void> }
   */
  async onApprove(e: MouseEvent): Promise<void> {
    if (!this.session.isAdmin()) {
      return;
    }

    this.approving = true;
    const promise = this.service.approve(this.boost);

    promise.then(() => {
      this.approving = false;
    });
  }

  /**
   * Called upon reject button being clicked by admin.
   * @param { MouseEvent } e - mouse event.
   * @returns { void }
   */
  public onReject(e: MouseEvent): void {
    if (!this.session.isAdmin()) {
      return;
    }

    this.rejecting = true;
    const promise = this.service.reject(this.boost);

    promise.then(() => {
      this.rejecting = false;
    });
  }

  /**
   * Called upon cancel button being clicked.
   * @param { MouseEvent } e - mouse event.
   * @returns { void }
   */
  public onCancel(e: MouseEvent): void {
    this.cancelling = true;
    const promise = this.service.cancel(this.boost);

    promise.then(() => {
      this.cancelling = false;
    });
  }

  /**
   * Whether boost is in pending state.
   * @returns { boolean } true if boost is pending.
   */
  public boostIsPending(): boolean {
    return this.boost.boost_status === BoostState.PENDING;
  }
}
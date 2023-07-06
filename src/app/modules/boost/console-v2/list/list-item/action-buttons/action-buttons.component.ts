import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Session } from '../../../../../../services/session';
import { Boost, BoostState } from '../../../../boost.types';
import { BoostConsoleService } from '../../../services/console.service';
import { BoostRejectionModalService } from '../../../modal/rejection-modal/services/boost-rejection-modal.service';

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

  @Output('onAction') onActionEmitter: EventEmitter<any> = new EventEmitter();

  /**
   * Button loading states
   */
  approving: boolean = false;
  rejecting: boolean = false;
  cancelling: boolean = false;

  constructor(
    private session: Session,
    public service: BoostConsoleService,
    private boostRejectionModal: BoostRejectionModalService
  ) {}

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

    this.onActionEmitter.emit();

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

    // ojm old -----------------------
    this.rejecting = true;
    const promise = this.service.reject(this.boost);

    this.onActionEmitter.emit();

    promise.then(() => {
      this.rejecting = false;
    });
    // ojm new
    this.boostRejectionModal.open(this.boost);
    // -----------------------
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

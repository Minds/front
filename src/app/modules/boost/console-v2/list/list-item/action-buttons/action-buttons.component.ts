import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Session } from '../../../../../../services/session';
import { Boost, BoostState } from '../../../../boost.types';
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

  /**
   * The api state (button loading states)
   */
  public readonly inProgress$$: BehaviorSubject<boolean> = this.service
    .inProgress$$;

  /**
   * Whether we should show buttons for admins
   */
  public readonly adminContext$: BehaviorSubject<boolean> = this.service
    .adminContext$;

  constructor(
    private session: Session,
    private router: Router,
    public service: BoostConsoleService
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
  public onReject(e: MouseEvent): void {
    this.service.reject(this.boost);
  }

  /**
   * Called upon cancel button being clicked.
   * @param { MouseEvent } e - mouse event.
   * @returns { void }
   */
  public onCancel(e: MouseEvent): void {
    this.service.cancel(this.boost);
  }

  /**
   * Whether approve and reject buttons should be shown.
   * @returns { boolean } true if approve and reject buttons should be shown.
   */
  public boostIsPending(): boolean {
    return this.boost.boost_status === BoostState.PENDING;
  }
}

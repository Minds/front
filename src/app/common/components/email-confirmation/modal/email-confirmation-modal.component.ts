import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import noOp from '../../../../helpers/no-op';
import {
  EmailAddress,
  EmailConfirmationModalService,
  EmailConfirmationPanel,
} from './email-confirmation-modal.service';

/**
 * Email confirmation modal component - wraps interior panels.
 */
@Component({
  selector: 'm-emailConfirmation__modal',
  templateUrl: 'email-confirmation-modal.component.html',
  styleUrls: ['email-confirmation-modal.component.ng.scss'],
})
export class EmailConfirmationModalComponent {
  // currently active panel from service.
  public readonly activePanel$: BehaviorSubject<EmailConfirmationPanel> = this
    .service.activePanel$;

  // members email from service.
  public readonly email$: BehaviorSubject<EmailAddress> = this.service.email$;

  // initial loading state from service.
  public readonly loading$: BehaviorSubject<boolean> = this.service.loading$;

  constructor(public service: EmailConfirmationModalService) {}

  /**
   * Called on success. Defaults to a no-op function.
   * @returns { void }
   */
  public onSuccessIntent: (any: any) => void = noOp;

  /**
   * Modal options.
   * @param { Object } data - Object containing onSuccess function.
   * @returns { void }
   */
  public setModalData({ onSuccess = null }): void {
    this.onSuccessIntent = onSuccess || noOp;
  }
}

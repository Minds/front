import { Injectable, Injector } from '@angular/core';
import { ModalService } from '../../../../services/ux/modal.service';
import { ConfirmV2Component } from '../../../modals/confirm-v2/confirm.component';

/**
 * Service to handle the Boost cancellation confirmation modal.
 */
@Injectable({ providedIn: 'root' })
export class BoostCancelModalService {
  constructor(
    private modalService: ModalService,
    private injector: Injector
  ) {}

  /**
   * Confirm the action of a user cancelling their own boost.
   * @returns { Promise<boolean> } - Whether the user confirmed the action.
   */
  public async confirmSelfBoostCancellation(): Promise<boolean> {
    const modal = this.modalService.present(ConfirmV2Component, {
      data: {
        title: 'Cancel this Boost?',
        body: 'Are you sure you want to cancel this Boost? If it is already running, then it **will not be refunded**.',
        confirmButtonText: 'Cancel Boost',
        confirmButtonColor: 'red',
        showCancelButton: false,
        onConfirm: () => {
          modal.close(true);
        },
      },
      injector: this.injector,
    });
    return modal?.result;
  }

  /**
   * Confirm the action of cancelling boosts for a moderator.
   * @returns { Promise<boolean> } - Whether the user confirmed the action.
   */
  public async confirmModeratorBoostCancellation(): Promise<boolean> {
    const modal = this.modalService.present(ConfirmV2Component, {
      data: {
        title: 'Cancel this Boost?',
        body: 'Are you sure you want to cancel this Boosted post? All active Boosts with this post will be immediately cancelled and will stop serving on your network, and the customer(s) **will not be refunded**.',
        confirmButtonText: 'Cancel Boost',
        confirmButtonColor: 'red',
        showCancelButton: false,
        onConfirm: () => {
          modal.close(true);
        },
      },
      injector: this.injector,
    });
    return modal?.result;
  }
}

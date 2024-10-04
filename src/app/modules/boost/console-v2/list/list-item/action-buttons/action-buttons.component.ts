import { Component, Injector, Input } from '@angular/core';
import { Boost, BoostPaymentMethod, BoostState } from '../../../../boost.types';
import { BoostConsoleService } from '../../../services/console.service';
import { BoostRejectionModalService } from '../../../modal/rejection-modal/services/boost-rejection-modal.service';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { BoostCancelModalService } from '../../../services/cancel-modal.service';
import {
  ModalRef,
  ModalService,
} from '../../../../../../services/ux/modal.service';
import { ConfirmV2Component } from '../../../../../modals/confirm-v2/confirm.component';
import { ConfigsService } from '../../../../../../common/services/configs.service';

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

  /** Whether a boost has been cancelled via action. */
  private readonly boostCancelled$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  /** Whether cancel button should be shown. */
  protected readonly shouldShowCancelButton$: Observable<boolean> =
    combineLatest([this.service.adminContext$, this.boostCancelled$]).pipe(
      map(([adminContext, boostCancelled]: [boolean, boolean]): boolean => {
        return (
          !boostCancelled &&
          !adminContext &&
          [BoostState.PENDING, BoostState.APPROVED].includes(
            this.boost.boost_status
          )
        );
      })
    );

  constructor(
    public service: BoostConsoleService,
    private boostRejectionModal: BoostRejectionModalService,
    private boostCancelModalService: BoostCancelModalService,
    private modalService: ModalService,
    private injector: Injector,
    private config: ConfigsService
  ) {}

  /**
   * Called upon approve button being clicked by admin.
   * @param { MouseEvent } e - mouse event.
   * @returns { Promise<void> }
   */
  async onApprove(e: MouseEvent): Promise<void> {
    if (this.boost.payment_method === BoostPaymentMethod.ONCHAIN_TOKENS) {
      this.withGasPriceWarningModal(() => this.approveBoost());
      return;
    }

    this.approveBoost();
  }

  private async approveBoost(): Promise<void> {
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
    if (this.boost.payment_method === BoostPaymentMethod.ONCHAIN_TOKENS) {
      this.withGasPriceWarningModal(() =>
        this.boostRejectionModal.open(this.boost)
      );
      return;
    }

    this.boostRejectionModal.open(this.boost);
  }

  /**
   * Called upon cancel button being clicked.
   * @param { MouseEvent } e - mouse event.
   * @returns { void }
   */
  public async onCancel(e: MouseEvent): Promise<void> {
    if (!(await this.boostCancelModalService.confirmSelfBoostCancellation())) {
      return;
    }

    this.cancelling = true;
    const promise = this.service.cancel(this.boost);

    promise.then(() => {
      this.cancelling = false;
      this.boost.boost_status = BoostState.CANCELLED;
      this.boostCancelled$.next(true);
    });
  }

  /**
   * Whether boost is in pending state.
   * @returns { boolean } true if boost is pending.
   */
  public boostIsPending(): boolean {
    return this.boost.boost_status === BoostState.PENDING;
  }

  /**
   * Show gas price warning modal before executing a callback function.
   * @param { Function } successCallbackFn - Function to call after modal confirmation.
   * @returns { void }
   */
  private withGasPriceWarningModal(successCallbackFn: Function): void {
    const serverGasPrice: string =
      this.config.get('blockchain')['server_gas_price'] ?? 'Unknown';
    const modalRef: ModalRef<ConfirmV2Component> = this.modalService.present(
      ConfirmV2Component,
      {
        data: {
          title: 'Warning!',
          body: `
            Check the [current gas price](https://etherscan.io/gastracker).
            This transaction will be dispatched with a gas price of: **${serverGasPrice}** Gwei
          `,
          confirmButtonText: 'Continue',
          confirmButtonColor: 'blue',
          confirmButtonSolid: false,
          showCancelButton: true,
          onConfirm: () => {
            modalRef.close();
            successCallbackFn();
          },
        },
        injector: this.injector,
      }
    );
  }
}

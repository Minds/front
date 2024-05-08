import { Component, Inject, Injector } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ModalService } from '../../../../../../../services/ux/modal.service';
import { ConfirmV2Component } from '../../../../../../modals/confirm-v2/confirm.component';
import { BoostPaymentCategory } from '../../../../boost-modal-v2.types';
import { BoostModalV2Service } from '../../../../services/boost-modal-v2.service';
import { IS_TENANT_NETWORK } from '../../../../../../../common/injection-tokens/tenant-injection-tokens';

@Component({
  selector: 'm-boostModalV2__budgetTabBar',
  templateUrl: './tab-bar.component.html',
  styleUrls: ['tab-bar.component.ng.scss'],
})
export class BoostModalV2BudgetTabBarComponent {
  // enums.
  public BoostPaymentCategory: typeof BoostPaymentCategory =
    BoostPaymentCategory;

  // category for payment.
  public readonly paymentCategory$: BehaviorSubject<BoostPaymentCategory> =
    this.service.paymentCategory$;

  constructor(
    private service: BoostModalV2Service,
    private modal: ModalService,
    private injector: Injector,
    @Inject(IS_TENANT_NETWORK) protected readonly isTenantNetwork: boolean
  ) {}

  /**
   * On tab click, change tabs. If we're changing from cash - show confirmation modal first.
   * @param { BoostPaymentCategory } paymentCategory - category for tab we're switching to.
   * @returns { void }
   */
  public onTabClick(paymentCategory: BoostPaymentCategory): void {
    if (paymentCategory === this.paymentCategory$.getValue()) {
      return;
    }

    if (paymentCategory !== BoostPaymentCategory.CASH && this.isTenantNetwork) {
      return;
    }

    // NOTE: keeping this in case we want to bring it back.
    // If we do bring it back, also change this comp's spec test and
    // navigateToBudgetTab() in e2e/fragments/boostModalComponent.ts
    //
    // if (paymentCategory === BoostPaymentCategory.TOKENS) {
    //   const modal = this.modal.present(ConfirmV2Component, {
    //     data: {
    //       title: 'Are you sure you want to use tokens?',
    //       body: 'You will receive more views when using cash.',
    //       confirmButtonColor: 'blue',
    //       confirmButtonSolid: true,
    //       onConfirm: () => {
    //         this.paymentCategory$.next(paymentCategory);
    //         this.service.paymentMethodId$.next(null);
    //         modal.dismiss();
    //       },
    //     },
    //     injector: this.injector,
    //   });
    //   return;
    // }
    this.paymentCategory$.next(paymentCategory);
  }
}

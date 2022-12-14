import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../../common/common.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaymentsModule } from '../../payments/payments.module';
import { BoostModalV2Component } from './boost-modal-v2.component';
import { BoostModalV2FooterComponent } from './footer/footer.component';
import { BoostModalV2HeaderComponent } from './header/header.component';
import { BoostModalV2AudienceSelectorComponent } from './panels/audience/audience.component';
import { BoostModalV2BudgetSelectorComponent } from './panels/budget/budget.component';
import { BoostModalV2BudgetTabBarComponent } from './panels/budget/tabs/tab-bar/tab-bar.component';
import { BoostModalV2BudgetTabComponent } from './panels/budget/tabs/tab/tab.component';
import { BoostModalV2ReviewComponent } from './panels/review/review.component';
import { BoostModalV2PaymentMethodSelectorComponent } from './panels/review/payment-method-selector/payment-method-selector.component';

/**
 * Lazy loaded module.
 */
@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PaymentsModule,
  ],
  declarations: [
    BoostModalV2Component,
    BoostModalV2HeaderComponent,
    BoostModalV2FooterComponent,
    BoostModalV2AudienceSelectorComponent,
    BoostModalV2BudgetSelectorComponent,
    BoostModalV2BudgetTabBarComponent,
    BoostModalV2BudgetTabComponent,
    BoostModalV2ReviewComponent,
    BoostModalV2PaymentMethodSelectorComponent,
  ],
})
export class BoostModalV2LazyModule {
  /**
   * Resolve component from module to root boost modal component.
   * @returns { typeof BoostModalV2Component } Boost modal component for lazy loading.
   */
  public resolveComponent(): typeof BoostModalV2Component {
    return BoostModalV2Component;
  }
}

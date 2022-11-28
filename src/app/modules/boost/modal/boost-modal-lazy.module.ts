import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../../common/common.module';
import { BoostModalComponent } from './boost-modal.component';
import { BoostModalTabsComponent } from './tabs/boost-modal-tabs.component';
import { BoostModalAmountInputComponent } from './inputs/amount-input/amount-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BoostModalPaymentMethodSelectorComponent } from './inputs/payment-method-selector/payment-method-selector.component';
import { PaymentsModule } from '../../payments/payments.module';

const COMPONENTS = [
  BoostModalComponent,
  BoostModalTabsComponent,
  BoostModalAmountInputComponent,
  BoostModalPaymentMethodSelectorComponent,
];

const PROVIDERS = [];

const MODULES = [
  NgCommonModule,
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  PaymentsModule,
];

/**
 * Lazy loaded module.
 */
@NgModule({
  imports: [...MODULES],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  providers: [...PROVIDERS],
})
export class BoostModalLazyModule {
  public resolveComponent(): typeof BoostModalComponent {
    return BoostModalComponent;
  }
}

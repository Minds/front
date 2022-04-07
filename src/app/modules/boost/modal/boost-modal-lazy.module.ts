import {
  ComponentFactory,
  ComponentFactoryResolver,
  NgModule,
} from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../../common/common.module';
import { BoostModalComponent } from './boost-modal.component';
import { BoostModalTabsComponent } from './tabs/boost-modal-tabs.component';
import { BoostModalAmountInputComponent } from './inputs/amount-input/amount-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BoostModalPaymentMethodSelectorComponent } from './inputs/payment-method-selector/payment-method-selector.component';
import { BoostModalOfferTargetInputComponent } from './inputs/offer-target-input/offer-target-input.component';

const COMPONENTS = [
  BoostModalComponent,
  BoostModalTabsComponent,
  BoostModalAmountInputComponent,
  BoostModalPaymentMethodSelectorComponent,
  BoostModalOfferTargetInputComponent,
];

const PROVIDERS = [];

const MODULES = [
  NgCommonModule,
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
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
  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  public resolveComponent(): ComponentFactory<BoostModalComponent> {
    return this.componentFactoryResolver.resolveComponentFactory(
      BoostModalComponent
    );
  }
}

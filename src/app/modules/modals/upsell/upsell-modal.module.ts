import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../../common/common.module';
import { ModalsModule } from '../../modals/modals.module';
import { UpsellModalComponent } from './upsell-modal/upsell-modal.component';
import { UpsellButtonComponent } from './upsell-button/upsell-button.component';

/**
 * Module for UpsellModalComponent.
 * Can be used to lazy-load.
 */
@NgModule({
  imports: [NgCommonModule, CommonModule, ModalsModule],
  declarations: [UpsellButtonComponent, UpsellModalComponent],
})
export class UpsellModalModule {
  /**
   * Resolve component to UpsellModalComponent instance.
   * @returns { typeof UpsellModalComponent }
   */
  public resolveComponent(): typeof UpsellModalComponent {
    return UpsellModalComponent;
  }
}

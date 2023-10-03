import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../../../../../../common/common.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GiftRecipientModalComponent } from './gift-recipient-modal.component';

/**
 * Lazy loaded module.
 */
@NgModule({
  imports: [NgCommonModule, CommonModule, FormsModule, ReactiveFormsModule],
  declarations: [GiftRecipientModalComponent],
})
export class GiftRecipientModalLazyModule {
  /**
   * Resolve component from module to gift recipient modal component.
   * @returns { typeof GiftRecipientModalComponent } GiftRecipientModalComponent for lazy loading.
   */
  public resolveComponent(): typeof GiftRecipientModalComponent {
    return GiftRecipientModalComponent;
  }
}

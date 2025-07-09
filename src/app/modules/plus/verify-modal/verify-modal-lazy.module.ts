import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../../common/common.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PlusVerifyModalComponent } from './verify-modal.component';
import { ModalCloseButtonComponent } from '../../../common/components/modal-close-button/modal-close-button.component';

/**
 * Lazy loaded module.
 */
@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalCloseButtonComponent,
  ],
  declarations: [PlusVerifyModalComponent],
})
export class PlusVerifyModalLazyModule {
  /**
   * Resolve component from module to root plus verify modal component.
   * @returns { typeof PlusVerifyModalComponent} Plus verify modal component for lazy loading.
   */
  public resolveComponent(): typeof PlusVerifyModalComponent {
    return PlusVerifyModalComponent;
  }
}

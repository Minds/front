import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../../common/common.module';
import { VerifyUniquenessModalComponent } from './verify-uniqueness-modal.component';

@NgModule({
  imports: [NgCommonModule, CommonModule],
  declarations: [VerifyUniquenessModalComponent],
  exports: [VerifyUniquenessModalComponent],
  providers: [],
})
export class VerifyUniquenessModalLazyModule {
  /**
   * Resolve component from module to root boost modal component.
   * @returns { typeof VerifyUniquenessModalComponent } Boost modal component for lazy loading.
   */
  public resolveComponent(): typeof VerifyUniquenessModalComponent {
    return VerifyUniquenessModalComponent;
  }
}

import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { BoostRejectionModalComponent } from './boost-rejection-modal.component';
import { CommonModule } from '../../../../../common/common.module';

@NgModule({
  imports: [NgCommonModule, CommonModule],
  declarations: [BoostRejectionModalComponent],
  exports: [BoostRejectionModalComponent],
  providers: [],
})
export class BoostRejectionModalLazyModule {
  /**
   * Resolve component from module to root boost rejection modal component.
   * @returns { typeof BoostRejectionModalComponent } Boost rejection modal component for lazy loading.
   */
  public resolveComponent(): typeof BoostRejectionModalComponent {
    return BoostRejectionModalComponent;
  }
}

import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../../common/common.module';
import { AppDownloadModalComponent } from '../../modals/app-download/app-download.component';

@NgModule({
  imports: [NgCommonModule, CommonModule],
  declarations: [AppDownloadModalComponent],
  exports: [AppDownloadModalComponent],
  providers: [],
})
export class AppDownloadModalLazyModule {
  /**
   * Resolve component from module to root app download modal.
   * @returns { typeof AppDownloadModalComponent } App download component for lazy loading.
   */
  public resolveComponent(): typeof AppDownloadModalComponent {
    return AppDownloadModalComponent;
  }
}

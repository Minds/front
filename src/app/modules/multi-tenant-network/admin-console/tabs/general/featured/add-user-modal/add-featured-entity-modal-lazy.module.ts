import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../../../../../../common/common.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddFeaturedEntityModalComponent } from './add-featured-entity-modal.component';

/**
 * Module for lazy loading.
 */
@NgModule({
  imports: [NgCommonModule, CommonModule, FormsModule, ReactiveFormsModule],
  declarations: [AddFeaturedEntityModalComponent],
})
export class AddFeaturedEntityModalLazyModule {
  /**
   * Resolve component from module to AddFeaturedEntityModalComponent.
   * @returns { typeof AddFeaturedEntityModalComponent } AddFeaturedEntityModalComponent for lazy loading.
   */
  public resolveComponent(): typeof AddFeaturedEntityModalComponent {
    return AddFeaturedEntityModalComponent;
  }
}

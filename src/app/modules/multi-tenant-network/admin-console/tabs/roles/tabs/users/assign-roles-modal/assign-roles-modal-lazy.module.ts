import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../../../../../../../common/common.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AssignRolesModalComponent } from './assign-roles-modal.component';
import { NetworkAdminConsoleSharedModule } from '../../../../../network-admin-console-shared.module';

/**
 * Module for lazy loading.
 */
@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NetworkAdminConsoleSharedModule,
  ],
  declarations: [AssignRolesModalComponent],
})
export class AssignRolesModalLazyModule {
  /**
   * Resolve component from module to AssignRolesModalComponent.
   * @returns { typeof AssignRolesModalComponent } AssignRolesModalComponent for lazy loading.
   */
  public resolveComponent(): typeof AssignRolesModalComponent {
    return AssignRolesModalComponent;
  }
}

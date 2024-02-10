import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../../common/common.module';
import { NetworkAdminConsoleRoleIconComponent } from './components/role-icon/role-icon.component';

@NgModule({
  imports: [NgCommonModule, CommonModule],
  declarations: [NetworkAdminConsoleRoleIconComponent],
  exports: [NetworkAdminConsoleRoleIconComponent],
})
export class NetworkAdminConsoleSharedModule {}

import { NgModule } from '@angular/core';
import { NetworkAdminConsoleRoleIconComponent } from './components/role-icon/role-icon.component';
import { CommonModule as NgCommonModule } from '@angular/common';

@NgModule({
  imports: [NgCommonModule],
  declarations: [NetworkAdminConsoleRoleIconComponent],
  exports: [NetworkAdminConsoleRoleIconComponent],
})
export class NetworkAdminConsoleSharedModule {}

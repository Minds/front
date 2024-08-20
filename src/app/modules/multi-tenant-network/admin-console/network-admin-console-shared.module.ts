import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../../common/common.module';
import { NetworkAdminConsoleRoleIconComponent } from './components/role-icon/role-icon.component';
import { NetworkAdminConsoleConfigSettingsToggleComponent } from './components/config-settings-toggle/config-settings-toggle.component';

@NgModule({
  imports: [NgCommonModule, CommonModule],
  declarations: [
    NetworkAdminConsoleRoleIconComponent,
    NetworkAdminConsoleConfigSettingsToggleComponent,
  ],
  exports: [
    NetworkAdminConsoleRoleIconComponent,
    NetworkAdminConsoleConfigSettingsToggleComponent,
  ],
})
export class NetworkAdminConsoleSharedModule {}

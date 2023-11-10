import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../../common/common.module';
import { NetworkAdminConsoleComponent } from './console.component';
import { PathMatch } from '../../../common/types/angular.types';
import { RouterModule, Routes } from '@angular/router';
import { NetworkAdminConsoleTabsComponent } from './tabs/tabs.component';
import { NetworkAdminConsoleGeneralComponent } from './tabs/general/general.component';
import { NetworkAdminConsoleAppearanceComponent } from './tabs/appearance/appearance.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NetworkSettingsAuthGuard } from './guards/network-settings-auth.guard';
import { NetworkAdminConsoleDomainComponent } from './tabs/domain/domain.component';
import { NetworkAdminConsoleEditDomainModalComponent } from './tabs/domain/edit-domain-modal/edit-domain-modal.component';
import { MultiTenantDomainService } from '../services/domain.service';
import { NetworkAdminConsoleModerationComponent } from './tabs/moderation/moderation.component';
import { NetworkAdminConsoleModerationGuidelinesComponent } from './tabs/moderation/moderation-guidelines/moderation-guidelines.component';

const NETWORK_ADMIN_CONSOLE_ROUTES: Routes = [
  {
    path: '',
    component: NetworkAdminConsoleComponent,
    canActivate: [NetworkSettingsAuthGuard],
    children: [
      { path: '', redirectTo: 'general', pathMatch: 'full' as PathMatch },
      { path: 'general', component: NetworkAdminConsoleGeneralComponent },
      { path: 'appearance', component: NetworkAdminConsoleAppearanceComponent },
      { path: 'domain', component: NetworkAdminConsoleDomainComponent },
      {
        path: 'moderation',
        component: NetworkAdminConsoleModerationComponent,
        children: [
          {
            path: '',
            redirectTo: 'guidelines',
            pathMatch: 'full' as PathMatch,
          },
          {
            path: 'guidelines',
            component: NetworkAdminConsoleModerationGuidelinesComponent,
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(NETWORK_ADMIN_CONSOLE_ROUTES),
  ],
  declarations: [
    NetworkAdminConsoleComponent,
    NetworkAdminConsoleTabsComponent,
    NetworkAdminConsoleGeneralComponent,
    NetworkAdminConsoleAppearanceComponent,
    NetworkAdminConsoleDomainComponent,
    NetworkAdminConsoleEditDomainModalComponent,
    NetworkAdminConsoleModerationComponent,
    NetworkAdminConsoleModerationGuidelinesComponent,
  ],
  providers: [MultiTenantDomainService],
})
export class NetworkAdminConsoleModule {}

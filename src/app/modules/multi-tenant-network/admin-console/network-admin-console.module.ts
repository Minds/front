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
import { NetworkAdminConsoleFeaturedComponent } from './tabs/general/featured/featured.component';
import { NetworkAdminConsoleFeaturedEntityRowComponent } from './tabs/general/featured/row/row.component';
import { NetworkAdminConsoleDomainComponent } from './tabs/domain/domain.component';
import { NetworkAdminConsoleEditDomainModalComponent } from './tabs/domain/edit-domain-modal/edit-domain-modal.component';
import { MultiTenantDomainService } from '../services/domain.service';
import { NetworkAdminConsoleModerationComponent } from './tabs/moderation/moderation.component';
import { NetworkAdminConsoleModerationGuidelinesComponent } from './tabs/moderation/moderation-guidelines/moderation-guidelines.component';
import { NetworkAdminConsoleRolesComponent } from './tabs/roles/roles.component';
import { NetworkAdminConsoleRolesPermissionsComponent } from './tabs/roles/tabs/permissions/permissions.component';
import { NetworkAdminConsoleRolesUsersComponent } from './tabs/roles/tabs/users/users.component';
import { NetworkAdminConsoleSharedModule } from './network-admin-console-shared.module';
import { NetworkAdminConsoleInviteComponent } from './tabs/invite/invite.component';
import { NetworkAdminConsoleInviteSendComponent } from './tabs/invite/tabs/send/send.component';
import { NetworkAdminConsoleInviteInvitationsComponent } from './tabs/invite/tabs/invitations/invitations.component';
import { RoleChipComponent } from './components/role-chip/role-chip.component';
import { RoleAggregatorComponent } from './components/role-aggregator/role-aggregator.component';

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
          {
            path: 'reports',
            loadChildren: async () =>
              (await import('./tabs/moderation/reports/reports-lazy.module'))
                .NetworkAdminReportLazyModule,
          },
        ],
      },
      {
        path: 'roles',
        redirectTo: 'roles/permissions',
        pathMatch: 'full' as PathMatch,
      },
      {
        path: 'roles/:view',
        component: NetworkAdminConsoleRolesComponent,
      },
      {
        path: 'invite',
        redirectTo: 'invite/send',
        pathMatch: 'full' as PathMatch,
      },
      {
        path: 'invite/:view',
        component: NetworkAdminConsoleInviteComponent,
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
    NetworkAdminConsoleSharedModule,
  ],
  declarations: [
    NetworkAdminConsoleComponent,
    NetworkAdminConsoleTabsComponent,
    NetworkAdminConsoleGeneralComponent,
    NetworkAdminConsoleAppearanceComponent,
    NetworkAdminConsoleFeaturedComponent,
    NetworkAdminConsoleFeaturedEntityRowComponent,
    NetworkAdminConsoleDomainComponent,
    NetworkAdminConsoleEditDomainModalComponent,
    NetworkAdminConsoleModerationComponent,
    NetworkAdminConsoleModerationGuidelinesComponent,
    NetworkAdminConsoleRolesComponent,
    NetworkAdminConsoleRolesPermissionsComponent,
    NetworkAdminConsoleRolesUsersComponent,
    NetworkAdminConsoleInviteComponent,
    NetworkAdminConsoleInviteSendComponent,
    NetworkAdminConsoleInviteInvitationsComponent,
    RoleChipComponent,
    RoleAggregatorComponent,
  ],
  providers: [MultiTenantDomainService],
})
export class NetworkAdminConsoleModule {}

import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../../common/common.module';
import { NetworkAdminConsoleComponent } from './console.component';
import { PathMatch } from '../../../common/types/angular.types';
import { RouterModule, Routes } from '@angular/router';
import { NetworkAdminConsoleTabsComponent } from './tabs/tabs.component';
import { NetworkAdminConsoleFederationSettingsComponent } from './tabs/general/federation-settings/federation-settings.component';
import { NetworkAdminConsoleAppearanceComponent } from './tabs/appearance/appearance.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NetworkSettingsAuthGuard } from './guards/network-settings-auth.guard';
import { NetworkAdminConsoleFeaturedComponent } from './tabs/general/featured/featured.component';
import { NetworkAdminConsoleFeaturedEntityRowComponent } from './tabs/general/featured/row/row.component';
import { NetworkAdminConsoleDomainComponent } from './tabs/domain/domain.component';
import { NetworkAdminConsoleEditDomainModalComponent } from './tabs/domain/edit-domain-modal/edit-domain-modal.component';
import { MultiTenantDomainService } from '../services/domain.service';
import { NetworkAdminConsoleModerationComponent } from './tabs/moderation/moderation.component';
import { NetworkAdminConsoleCommunityGuidelinesComponent } from './tabs/moderation/community-guidelines/community-guidelines.component';
import { NetworkAdminConsoleRolesComponent } from './tabs/roles/roles.component';
import { NetworkAdminConsoleRolesPermissionsComponent } from './tabs/roles/tabs/permissions/permissions.component';
import { NetworkAdminConsoleRolesUsersComponent } from './tabs/roles/tabs/users/users.component';
import { CustomPageFormComponent } from './components/custom-page-form/custom-page-form.component';
import { NetworkAdminConsolePrivacyPolicyComponent } from './tabs/moderation/privacy-policy/privacy-policy.component';
import { NetworkAdminConsoleTermsOfServiceComponent } from './tabs/moderation/terms-of-service/terms-of-service.component';
import { NetworkAdminConsoleGeneralComponent } from './tabs/general/general.component';
import { NetworkAdminConsoleNsfwToggleComponent } from './tabs/moderation/nsfw-toggle/nsfw-toggle.component';
import { NetworkAdminConsoleInviteComponent } from './tabs/invite/invite.component';
import { NetworkAdminConsoleInviteSendComponent } from './tabs/invite/tabs/send/send.component';
import { NetworkAdminConsoleInviteInvitationsComponent } from './tabs/invite/tabs/invitations/invitations.component';
import { RoleChipComponent } from './components/role-chip/role-chip.component';
import { RoleAggregatorComponent } from './components/role-aggregator/role-aggregator.component';
import { NetworkAdminConsoleImageInputComponent } from './components/image-uploader/image-input.component';
import { NetworkAdminConsoleReplyEmailSettingsComponent } from './tabs/general/reply-email-settings/reply-email-settings.component';
import { AssignRolesModalComponent } from './tabs/roles/tabs/users/assign-roles-modal/assign-roles-modal.component';
import { NetworkAdminConsoleRoleIconComponent } from './components/role-icon/role-icon.component';
import { MarkdownModule } from 'ngx-markdown';
import { CustomPageFormContentPreviewModalComponent } from './components/custom-page-form/content-preview-modal/content-preview-modal.component';
import { GroupAggregatorComponent } from './components/group-aggregator/group-aggregator.component';

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
            redirectTo: 'reports',
            pathMatch: 'full' as PathMatch,
          },
          {
            path: 'privacy-policy',
            component: NetworkAdminConsolePrivacyPolicyComponent,
          },
          {
            path: 'terms-of-service',
            component: NetworkAdminConsoleTermsOfServiceComponent,
          },
          {
            path: 'community-guidelines',
            component: NetworkAdminConsoleCommunityGuidelinesComponent,
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
        path: 'mobile',
        loadChildren: async () =>
          (await import('./tabs/mobile/mobile-lazy.module'))
            .NetworkAdminMobileLazyModule,
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
    NetworkAdminConsoleImageInputComponent,
    MarkdownModule.forChild(),
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
    NetworkAdminConsolePrivacyPolicyComponent,
    NetworkAdminConsoleTermsOfServiceComponent,
    NetworkAdminConsoleCommunityGuidelinesComponent,
    NetworkAdminConsoleRolesComponent,
    NetworkAdminConsoleRolesPermissionsComponent,
    NetworkAdminConsoleRolesUsersComponent,
    NetworkAdminConsoleFederationSettingsComponent,
    NetworkAdminConsoleReplyEmailSettingsComponent,
    NetworkAdminConsoleNsfwToggleComponent,
    NetworkAdminConsoleInviteComponent,
    NetworkAdminConsoleInviteSendComponent,
    NetworkAdminConsoleInviteInvitationsComponent,
    RoleChipComponent,
    RoleAggregatorComponent,
    GroupAggregatorComponent,
    AssignRolesModalComponent,
    NetworkAdminConsoleRoleIconComponent,
    CustomPageFormComponent,
    CustomPageFormContentPreviewModalComponent,
  ],
  providers: [MultiTenantDomainService],
})
export class NetworkAdminConsoleModule {}

import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../../common/common.module';
import { NetworkAdminConsoleComponent } from './console.component';
import { PathMatch } from '../../../common/types/angular.types';
import { RouterModule, Routes } from '@angular/router';
import { NetworkAdminConsoleTabsComponent } from './tabs/tabs.component';
import { NetworkAdminConsoleFederationSettingsComponent } from './tabs/general/federation-settings/federation-settings.component';
import { NetworkAdminConsoleCustomizeComponent } from './tabs/customize/customize.component';
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
import { MarkdownModule } from 'ngx-markdown';
import { CustomPageFormContentPreviewModalComponent } from './components/custom-page-form/content-preview-modal/content-preview-modal.component';
import { CanModerateContentGuard } from './guards/can-moderate-content.guard';
import { GroupAggregatorComponent } from './components/group-aggregator/group-aggregator.component';
import { NetworkAdminConsoleSharedModule } from './network-admin-console-shared.module';
import { NetworkAdminAnalyticsLazyRoutes } from './tabs/analytics/analytics-lazy.routes';
import { NetworkAdminConsoleInviteLinkComponent } from './tabs/invite/tabs/link/link.component';
import { SiteMembershipCardComponent } from '../../site-memberships/components/membership-card/site-membership-card.component';
import { CopyToClipboardButtonComponent } from '../../../common/standalone/copy-to-clipboard-button/copy-to-clipboard-button.component';
import { NetworkAdminConsoleNavigationComponent } from './tabs/navigation/navigation.component';
import { NetworkAdminConsoleNavigationLinkFormComponent } from './tabs/navigation/components/link-form/link-form.component';
import { NetworkAdminConsoleNavigationMenuComponent } from './tabs/navigation/tabs/menu/menu.component';
import { NetworkAdminConsoleNavigationListComponent } from './tabs/navigation/components/list/list.component';
import { SelectableIconComponent } from '../../../common/standalone/selectable-icon/selectable-icon.component';
import { CanDeactivateGuardService } from '../../../services/can-deactivate-guard';
import { NetworkAdminConsoleLandingPageDescriptionComponent } from './tabs/general/landing-page-description/landing-page-description.component';
import { NetworkAdminConsoleEnableLandingPageToggleComponent } from './tabs/general/enable-landing-page-toggle/enable-landing-page-toggle.component';
import { NetworkAdminConsoleEnableWalledGardenToggleComponent } from './tabs/general/enable-walled-garden-toggle/enable-walled-garden-toggle.component';
import { boostEnabledGuard } from '../../../common/guards/can-boost.guard';
import { PermissionsEnum } from '../../../../graphql/generated.engine';
import { permissionGuard } from '../../../common/guards/permission.guard';
import { NetworkAdminConsoleRolesPermissionHandlingComponent } from './tabs/roles/tabs/permission-handling/permission-handling.component';
import { NetworkAdminConsoleDigestEmailSettingsComponent } from './tabs/general/digest-email-toggle/digest-email-toggle.component';
import { NetworkAdminConsoleLandingPageSelectorComponent } from './tabs/navigation/components/landing-page-section/landing-page-selector.component';
import { NetworkAdminConsoleBillingComponent } from './tabs/billing/billing.component';
import { NetworkAdminBookAMeetingComponent } from './tabs/general/book-a-meeting/book-a-meeting.component';
import { MultiTenantBootstrapProgressSplashComponent } from './components/bootstrap-progress-splash/bootstrap-progress-splash.component';
import { adminOnlyGuard } from '../../../common/guards/admin-only.guard';
import { NetworkAdminConsoleExcludedHashtagsListComponent } from './tabs/moderation/excluded-hashtags/list/excluded-hashtags-list.component';
import { NetworkAdminExcludedHashtagsSharedModule } from './tabs/moderation/excluded-hashtags/excluded-hashtags-shared.module';
import { NetworkAdminConsoleAuthComponent } from './tabs/auth/auth.component';
import { NetworkAdminConsoleAuthListComponent } from './tabs/auth/components/list.component';
import { NetworkAdminConsoleAuthEditComponent } from './tabs/auth/components/edit.component';
import { NetworkAdminCustomScriptComponent } from './tabs/customize/components/custom-script/custom-script.component';

const NETWORK_ADMIN_CONSOLE_ROUTES: Routes = [
  {
    path: '',
    component: NetworkAdminConsoleComponent,
    canActivate: [NetworkSettingsAuthGuard],
    children: [
      { path: '', redirectTo: 'general', pathMatch: 'full' as PathMatch },
      { path: 'general', component: NetworkAdminConsoleGeneralComponent },
      { path: 'customize', component: NetworkAdminConsoleCustomizeComponent },
      { path: 'appearance', redirectTo: 'customize', pathMatch: 'full' },
      { path: 'domain', component: NetworkAdminConsoleDomainComponent },
      { path: 'billing', component: NetworkAdminConsoleBillingComponent },
      {
        path: 'monetization',
        loadChildren: async () =>
          (await import('./tabs/monetization/monetization-lazy.module'))
            .NetworkAdminMonetizationLazyModule,
      },
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
            path: 'boosts',
            canActivate: [
              boostEnabledGuard('/network/admin'),
              permissionGuard(
                PermissionsEnum.CanModerateContent,
                '/network/admin'
              ),
            ],
            loadChildren: async () =>
              (await import('./tabs/moderation/boosts/boosts-lazy.module'))
                .NetworkAdminBoostsLazyModule,
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
            canActivate: [CanModerateContentGuard],
          },
          {
            path: 'hashtags',
            component: NetworkAdminConsoleExcludedHashtagsListComponent,
            canActivate: [CanModerateContentGuard],
          },
        ],
      },
      { path: 'authentication', component: NetworkAdminConsoleAuthComponent },
      {
        path: 'mobile',
        loadChildren: async () =>
          (await import('./tabs/mobile/mobile-lazy.module'))
            .NetworkAdminMobileLazyModule,
      },
      {
        path: 'navigation',
        component: NetworkAdminConsoleNavigationComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'menu/list',
          },
          {
            path: 'menu',
            children: [
              {
                path: '',
                pathMatch: 'full',
                redirectTo: 'list',
              },
              {
                path: 'list',
                component: NetworkAdminConsoleNavigationMenuComponent,
                children: [
                  {
                    path: '',
                    pathMatch: 'full',
                    component: NetworkAdminConsoleNavigationListComponent,
                  },
                ],
              },
              {
                path: 'edit',
                component: NetworkAdminConsoleNavigationMenuComponent,
                children: [
                  {
                    path: '',
                    pathMatch: 'full',
                    canDeactivate: [CanDeactivateGuardService],
                    component: NetworkAdminConsoleNavigationLinkFormComponent,
                  },
                ],
              },
            ],
          },
          {
            path: ':view', //  wildcards
            redirectTo: 'menu/list',
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
      NetworkAdminAnalyticsLazyRoutes,
    ],
  },
  {
    path: 'bootstrap',
    component: MultiTenantBootstrapProgressSplashComponent,
    canActivate: [adminOnlyGuard('/')],
    data: { preventLayoutReset: true },
  },
];

@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NetworkAdminConsoleSharedModule,
    NetworkAdminExcludedHashtagsSharedModule,
    RouterModule.forChild(NETWORK_ADMIN_CONSOLE_ROUTES),
    NetworkAdminConsoleImageInputComponent,
    MarkdownModule.forChild(),
    SiteMembershipCardComponent,
    CopyToClipboardButtonComponent,
    SelectableIconComponent,
    NetworkAdminBookAMeetingComponent,
    NetworkAdminConsoleRolesPermissionHandlingComponent,
    NetworkAdminCustomScriptComponent,
  ],
  declarations: [
    NetworkAdminConsoleComponent,
    NetworkAdminConsoleTabsComponent,
    NetworkAdminConsoleGeneralComponent,
    NetworkAdminConsoleCustomizeComponent,
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
    NetworkAdminConsoleLandingPageDescriptionComponent,
    NetworkAdminConsoleEnableLandingPageToggleComponent,
    NetworkAdminConsoleEnableWalledGardenToggleComponent,
    NetworkAdminConsoleDigestEmailSettingsComponent,
    NetworkAdminConsoleReplyEmailSettingsComponent,
    NetworkAdminConsoleNsfwToggleComponent,
    NetworkAdminConsoleInviteComponent,
    NetworkAdminConsoleInviteSendComponent,
    NetworkAdminConsoleInviteLinkComponent,
    NetworkAdminConsoleInviteInvitationsComponent,
    RoleChipComponent,
    RoleAggregatorComponent,
    GroupAggregatorComponent,
    AssignRolesModalComponent,
    CustomPageFormComponent,
    CustomPageFormContentPreviewModalComponent,
    NetworkAdminConsoleNavigationComponent,
    NetworkAdminConsoleNavigationMenuComponent,
    NetworkAdminConsoleNavigationListComponent,
    NetworkAdminConsoleNavigationLinkFormComponent,
    NetworkAdminConsoleLandingPageSelectorComponent,
    NetworkAdminConsoleAuthComponent,
    NetworkAdminConsoleAuthListComponent,
    NetworkAdminConsoleAuthEditComponent,
  ],
  providers: [MultiTenantDomainService],
})
export class NetworkAdminConsoleModule {}

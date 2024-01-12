import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';

import { AnalyticsModuleLazyRoutes } from './modules/analytics/analytics.lazy';
import { AdminModuleLazyRoutes } from './modules/admin/admin.lazy';
import { WalletModuleLazyRoutes } from './modules/wallet/wallet.lazy';
//import { MonetizationModuleLazyRoutes } from './modules/monetization/monetization.lazy';
import { SettingsV2ModuleLazyRoutes } from './modules/settings-v2/settings-v2.lazy';
import { Pages } from './controllers/pages/pages';
import { ChannelContainerComponent } from './modules/channel-container/channel-container.component';
import { CanDeactivateGuardService } from './services/can-deactivate-guard';
import { DiscoveryModuleLazyRoutes } from './modules/discovery/discovery.lazy';
import { CanaryModuleLazyRoutes } from './modules/canary/canary.lazy';
import { MobileModuleLazyRoutes } from './modules/mobile/mobile.lazy';
import { AuxModuleLazyRoutes } from './modules/aux-pages/aux-pages.lazy';
import {
  BlogModuleLazyRoutes,
  BlogSlugModuleLazyRoutes,
} from './modules/blogs/blog.lazy';
import { PathMatch } from './common/types/angular.types';
import { UpgradeModuleLazyRoutes } from './modules/upgrade/upgrade-lazy';
import { NetworksModuleLazyRoutes } from './modules/networks/networks.lazy';
import { NetworkAdminConsoleModuleLazyRoutes } from './modules/multi-tenant-network/admin-console/network-admin-console.lazy';
import { MindsOnlyRedirectGuard } from './common/guards/minds-only-redirect.guard';
import { CustomPagesModuleLazyRoutes } from './modules/custom-pages/custom-pages.module.lazy';

const routes: Routes = [
  AnalyticsModuleLazyRoutes,
  AdminModuleLazyRoutes,
  WalletModuleLazyRoutes,
  // MonetizationModuleLazyRoutes,
  SettingsV2ModuleLazyRoutes,
  DiscoveryModuleLazyRoutes,
  CanaryModuleLazyRoutes,
  MobileModuleLazyRoutes,
  AuxModuleLazyRoutes,
  NetworkAdminConsoleModuleLazyRoutes,
  BlogModuleLazyRoutes,
  BlogSlugModuleLazyRoutes,
  UpgradeModuleLazyRoutes,
  NetworksModuleLazyRoutes,
  CustomPagesModuleLazyRoutes,
  // TODO: Find a way to move channel routes onto its own Module. They take priority and groups/blogs cannot be accessed
  {
    path: ':username',
    redirectTo: ':username/',
    pathMatch: 'full' as PathMatch,
  },
  {
    path: ':username/:filter',
    loadChildren: () =>
      import('./modules/channel-container/channel-container.module').then(
        m => m.ChannelContainerModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      //initialNavigation: 'enabledBlocking',
      initialNavigation: 'disabled',
      onSameUrlNavigation: 'reload',
    }),
  ],
  exports: [RouterModule],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },
    MindsOnlyRedirectGuard,
  ],
})
export class AppRoutingModule {}

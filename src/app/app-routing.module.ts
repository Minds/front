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
import { HelpdeskModuleLazyRoutes } from './modules/helpdesk/helpdesk.lazy';
import { AuxModuleLazyRoutes } from './modules/aux-pages/aux-pages.lazy';
import {
  BlogModuleLazyRoutes,
  BlogSlugModuleLazyRoutes,
} from './modules/blogs/blog.lazy';

const routes: Routes = [
  AnalyticsModuleLazyRoutes,
  AdminModuleLazyRoutes,
  WalletModuleLazyRoutes,
  // MonetizationModuleLazyRoutes,
  SettingsV2ModuleLazyRoutes,
  DiscoveryModuleLazyRoutes,
  CanaryModuleLazyRoutes,
  MobileModuleLazyRoutes,
  HelpdeskModuleLazyRoutes,
  AuxModuleLazyRoutes,
  BlogModuleLazyRoutes,
  BlogSlugModuleLazyRoutes,
  // TODO: Find a way to move channel routes onto its own Module. They take priority and groups/blogs cannot be accessed
  { path: ':username', redirectTo: ':username/', pathMatch: 'full' },
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
      relativeLinkResolution: 'legacy',
    }),
  ],
  exports: [RouterModule],
  providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
})
export class AppRoutingModule {}

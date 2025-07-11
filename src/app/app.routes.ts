import { Routes, RouterModule } from '@angular/router';

import { AnalyticsModuleLazyRoutes } from './modules/analytics/analytics.lazy';
import { AdminModuleLazyRoutes } from './modules/admin/admin.lazy';
import { WalletModuleLazyRoutes } from './modules/wallet/wallet.lazy';
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
import { TenantOnlyRedirectGuard } from './common/guards/tenant-only-redirect.guard';
import { SiteMembershipsLazyRoutes } from './modules/site-memberships/site-memberships-lazy.routes';
import { ChatModuleLazyRoutes } from './modules/chat/chat.lazy';
import { HomepageContainerComponent } from './modules/homepage/homepage-container.component';

import { routes as aboutRoutes } from './modules/about/about.module';
import { routes as authRoutes } from './modules/auth/auth.module';
import { jobRoutes } from './modules/jobs/jobs.routes';
import { mediaRoutes } from './modules/media/media.routes';
import { newsfeedRoutes } from './modules/newsfeed/newsfeed.routes';
import { notificationRoutes } from './modules/notifications/notification.routes';
import { searchRoutes } from './modules/search/search.routes';
import { supermindRoutes } from './modules/supermind/supermind.routes';
import { i18nRoutes } from './modules/i18n/i18n.routes';
import { groupRoutes } from './modules/groups/groups.routes';
import { brandingRoutes } from './modules/branding/branding.routes';
import { boostRoutes } from './modules/boost/boost.routes';
import { blockchainRoutes } from './modules/blockchain/blockchain.routes';
import { devtoolRoutes } from './modules/devtools/devtools.routes';

export const routes: Routes = [
  {
    path: '',
    component: HomepageContainerComponent,
    data: {
      preventLayoutReset: true,
    },
  },

  ...newsfeedRoutes,
  ...aboutRoutes,
  ...authRoutes,
  ...blockchainRoutes,
  ...boostRoutes,
  ...brandingRoutes,
  ...devtoolRoutes,
  ...groupRoutes,
  ...i18nRoutes,
  ...jobRoutes,
  ...mediaRoutes,
  ...notificationRoutes,
  ...searchRoutes,
  ...supermindRoutes,
  AnalyticsModuleLazyRoutes,
  AdminModuleLazyRoutes,
  WalletModuleLazyRoutes,
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
  SiteMembershipsLazyRoutes,
  ChatModuleLazyRoutes,
  {
    path: 'email-confirmation',
    redirectTo: '/',
    pathMatch: 'full' as PathMatch,
  },
  {
    path: ':username',
    redirectTo: ({ params }) => {
      const username = params['username'];
      return username + '/';
    },
    pathMatch: 'full' as PathMatch,
  },
  {
    path: ':username/:filter',
    loadChildren: () =>
      import('./modules/channel-container/channel-container.module').then(
        (m) => m.ChannelContainerModule
      ),
  },
];

export default routes;

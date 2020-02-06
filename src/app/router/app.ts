import { Routes } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';

import { Capture } from '../controllers/capture/capture';
import { Discovery } from '../controllers/discovery/discovery';
import { Admin } from '../controllers/admin/admin';
import { Pages } from '../controllers/pages/pages';
import { CanDeactivateGuardService } from '../services/can-deactivate-guard';
import { RewardsComponent } from '../controllers/rewards/rewards';
import { ChannelContainerComponent } from '../modules/channel-container/channel-container.component';

export const MindsAppRoutes: Routes = [
  { path: 'capture', redirectTo: 'media/images/suggested' },
  { path: 'about', redirectTo: 'p/about' },

  // redirectTo: 'media/:type/:filter
  { path: 'discovery/suggested/channels', redirectTo: 'channels/suggested' },
  { path: 'discovery/trending/channels', redirectTo: 'channels/suggested' },
  { path: 'discovery/all/channels', redirectTo: 'channels/suggested' },

  { path: 'discovery/suggested/:type', redirectTo: 'media/:type/suggested' },
  { path: 'discovery/trending/:type', redirectTo: 'media/:type/suggested' },
  { path: 'discovery/all/:type', redirectTo: 'media/:type/suggested' },
  { path: 'discovery/owner/:type', redirectTo: 'media/:type/my' },

  { path: 'discovery/suggested', redirectTo: 'channels/suggested' },
  { path: 'discovery/trending', redirectTo: 'media/images/suggested' },
  { path: 'discovery/featured', redirectTo: 'channels/suggested' },

  /* /Legacy routes */

  { path: 'admin/:filter/:type', component: Admin, data: { title: 'Admin' } },
  { path: 'admin/:filter', component: Admin, data: { title: 'Admin' } },

  { path: 'p/:page', component: Pages },

  { path: 'claim-rewards/:uuid', component: RewardsComponent },

  // TODO: Find a way to move channel routes onto its own Module. They take priority and groups/blogs cannot be accessed
  { path: ':username', redirectTo: ':username/', pathMatch: 'full' },
  {
    path: ':username/:filter',
    component: ChannelContainerComponent,
    canDeactivate: [CanDeactivateGuardService],
  },
];

export const MindsAppRoutingProviders: any[] = [
  { provide: APP_BASE_HREF, useValue: '/' },
];
export const MINDS_APP_ROUTING_DECLARATIONS: any[] = [
  Capture,
  Discovery,
  Admin,
  Pages,
  RewardsComponent,
];

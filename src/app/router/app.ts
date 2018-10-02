import { Routes } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';

import {Capture} from '../controllers/capture/capture';
import {Discovery} from '../controllers/discovery/discovery';
import {Admin} from '../controllers/admin/admin';
import {Pages} from '../controllers/pages/pages';

import { ChannelComponent } from '../modules/channels/channel.component';
/**
 * TODO: Load these automagically from gulp
 */

import {CanDeactivateGuardService} from '../services/can-deactivate-guard';
import { RewardsComponent } from '../controllers/rewards/rewards';

export const MindsAppRoutes: Routes = [

  { path: 'capture', redirectTo: 'media/images/top' },

  // redirectTo: 'media/:type/:filter
  { path: 'discovery/suggested/channels', redirectTo: 'channels/top'},
  { path: 'discovery/trending/channels', redirectTo: 'channels/top'},
  { path: 'discovery/all/channels', redirectTo: 'channels/top'},

  { path: 'discovery/suggested/:type', redirectTo: 'media/:type/top' },
  { path: 'discovery/trending/:type', redirectTo: 'media/:type/top' },
  { path: 'discovery/all/:type', redirectTo: 'media/:type/top' },
  { path: 'discovery/owner/:type', redirectTo: 'media/:type/my' },

  { path: 'discovery/suggested', redirectTo: 'channels/top'},
  { path: 'discovery/trending', redirectTo: 'media/images/top'},
  { path: 'discovery/featured', redirectTo: 'channels/top'},

  /* /Legacy routes */

  { path: 'admin/:filter/:type', component: Admin },
  { path: 'admin/:filter', component: Admin },

  { path: 'p/:page', component: Pages },

  { path: 'claim-rewards/:uuid', component: RewardsComponent },

  { path: ':username/:filter', component: ChannelComponent },
  { path: ':username', component: ChannelComponent, canDeactivate: [CanDeactivateGuardService]},
];

export const MindsAppRoutingProviders: any[] = [{ provide: APP_BASE_HREF, useValue: '/' }];
export const MINDS_APP_ROUTING_DECLARATIONS: any[] = [
  Capture,
  Discovery,
  Admin,
  Pages,
  RewardsComponent,
];

import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
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

  { path: 'capture', component: Capture },

  { path: 'discovery/:filter/:type', component: Discovery },
  { path: 'discovery/:filter', component: Discovery },

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

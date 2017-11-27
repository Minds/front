import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';

import {Homepage} from '../controllers/home/homepage/homepage';
import {Login} from '../controllers/home/login/login';
import {Logout} from '../controllers/home/logout/logout';
import {Register} from '../controllers/home/register/register';
import {ForgotPassword} from '../controllers/home/forgot-password/forgot-password';
import {ComingSoon} from '../controllers/home/comingsoon/comingsoon';
import {Newsfeed, NewsfeedSingle} from '../controllers/newsfeed/newsfeed';
import {Capture} from '../controllers/capture/capture';
import {Discovery} from '../controllers/discovery/discovery';
import {Channel, ChannelSubscribers, ChannelSubscriptions} from '../controllers/channels/channel';
import {Settings} from '../controllers/settings/settings';
import {Admin} from '../controllers/admin/admin';
import {Pages} from '../controllers/pages/pages';
import {MediaView, MediaEdit} from '../controllers/media/media';

/**
 * TODO: Load these automagically from gulp
 */

import {CanDeactivateGuardService} from '../services/can-deactivate-guard';
import { RewardsComponent } from '../controllers/rewards/rewards';

export const MindsAppRoutes: Routes = [
  { path: '', component: Homepage },

  { path: 'login', component: Login },
  { path: 'logout', component: Logout },
  { path: 'register', component: Register },
  { path: 'forgot-password', component: ForgotPassword },

  { path: 'newsfeed/subscribed', component: Newsfeed, canDeactivate: [CanDeactivateGuardService] },
  { path: 'newsfeed/boost', component: Newsfeed, canDeactivate: [CanDeactivateGuardService] },
  { path: 'newsfeed/:guid', component: NewsfeedSingle },
  { path: 'newsfeed', component: Newsfeed, canDeactivate: [CanDeactivateGuardService] },
  { path: 'capture', component: Capture },

  { path: 'discovery/:filter/:type', component: Discovery },
  { path: 'discovery/:filter', component: Discovery },

  { path: 'media/edit/:guid', component: MediaEdit },
  { path: 'media/:container/:guid', component: MediaView },
  { path: 'media/:guid', component: MediaView },

  /* Legacy routes */
  { path: 'archive/view/:container/:guid', component: MediaView },
  { path: 'archive/view/:guid', component: MediaView },
  { path: 'archive/edit/:guid', component: MediaEdit },
  /* /Legacy routes */

  { path: 'settings/:filter/:card', component: Settings },
  { path: 'settings/:filter', component: Settings },

  { path: 'admin/:filter/:type', component: Admin },
  { path: 'admin/:filter', component: Admin },

  { path: 'p/:page', component: Pages },

  { path: 'claim-rewards/:uuid', component: RewardsComponent },

  { path: ':username/:filter', component: Channel },
  { path: ':username', component: Channel, canDeactivate: [CanDeactivateGuardService]},
];

export const MindsAppRoutingProviders: any[] = [{ provide: APP_BASE_HREF, useValue: '/' }];
export const MINDS_APP_ROUTING_DECLARATIONS: any[] = [
  Homepage,
  Login,
  Logout,
  Register,
  ForgotPassword,
  NewsfeedSingle,
  Newsfeed,
  Capture,
  Discovery,
  MediaView,
  MediaEdit,
  Settings,
  Admin,
  Pages,
  Channel,
  RewardsComponent,
];

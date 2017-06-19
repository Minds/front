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
import {Boosts} from '../controllers/boosts/boosts';
import {Capture} from '../controllers/capture/capture';
import {Discovery} from '../controllers/discovery/discovery';
import {Channel, ChannelSubscribers, ChannelSubscriptions} from '../controllers/channels/channel';
import {Notifications} from '../controllers/notifications/notifications';
import {Search} from '../controllers/search/search';
import {Settings} from '../controllers/settings/settings';
import {Admin} from '../controllers/admin/admin';
import {Pages} from '../controllers/pages/pages';

/**
 * TODO: Load these automagically from gulp
 */
import {Messenger} from '../plugins/Messenger/messenger';
import {Blog, BlogViewInfinite, BlogEdit} from '../plugins/blog/blog';
import {ArchiveView, ArchiveEdit} from '../plugins/archive/archive';
import {Groups, GroupsProfile, GroupsCreator} from '../plugins/Groups/groups';

export const MindsAppRoutes: Routes = [
  { path: '', component: Homepage },

  { path: 'login', component: Login },
  { path: 'logout', component: Logout },
  { path: 'register', component: Register },
  { path: 'forgot-password', component: ForgotPassword },

  { path: 'newsfeed/:guid', component: NewsfeedSingle },
  { path: 'newsfeed', component: Newsfeed },
  { path: 'capture', component: Capture },

  { path: 'boosts/:type/:filter', component: Boosts },
  { path: 'boosts/:type', component: Boosts },
  { path: 'boosts', component: Boosts },

  { path: 'discovery/:filter/:type', component: Discovery },
  { path: 'discovery/:filter', component: Discovery },

  { path: 'blog/view/:guid/:title', component:  BlogViewInfinite },
  { path: 'blog/view/:guid', component:  BlogViewInfinite },
  { path: 'blog/edit/:guid', component:  BlogEdit },
  { path: 'blog/:filter', component:  Blog },

  { path: 'archive/view/:container/:guid', component: ArchiveView },
  { path: 'archive/view/:guid', component: ArchiveView },
  { path: 'archive/edit/:guid', component: ArchiveEdit },

  { path: 'notifications/:filter', component: Notifications },
  { path: 'notifications', component: Notifications },

  { path: 'groups/profile/:guid/:filter', component: GroupsProfile },
  { path: 'groups/profile/:guid', component: GroupsProfile },
  { path: 'groups/create', component: GroupsCreator },
  { path: 'groups/:filter', component: Groups },

  { path: 'search', component: Search },

  { path: 'settings/:filter', component: Settings },

  { path: 'admin/:filter/:type', component: Admin },
  { path: 'admin/:filter', component: Admin },

  { path: 'p/:page', component: Pages },

  { path: ':username/:filter', component: Channel },
  { path: ':username', component: Channel },
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
  Boosts,
  Discovery,
  BlogViewInfinite,
  BlogEdit,
  Blog,
  ArchiveView,
  ArchiveEdit,
  Notifications,
  GroupsProfile,
  GroupsCreator,
  Groups,
  Search,
  Settings,
  Admin,
  Pages,
  Channel,
];

import {Component, View, provide} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {bootstrap} from 'angular2/platform/browser';
import {RouteConfig, Route, Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, ROUTER_PRIMARY_COMPONENT, APP_BASE_HREF} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';

import { NotificationService } from './src/services/notification';
import { AnalyticsService} from './src/services/analytics'
import { Client } from './src/services/api';
import { SOCKETS_PROVIDERS, SocketsService } from './src/services/sockets';

import {Topbar} from './src/components/topbar/topbar';
import {SidebarNavigation} from './src/components/sidebar-navigation/sidebar-navigation';
import {SignupModal} from './src/components/modal/modal';

import {Homepage} from './src/controllers/home/homepage/homepage';
import {Login} from './src/controllers/home/login/login';
import {Logout} from './src/controllers/home/logout/logout';
import {Register} from './src/controllers/home/register/register';
import {ForgotPassword} from './src/controllers/home/forgot-password/forgot-password';
import {ComingSoon} from './src/controllers/home/comingsoon/comingsoon';
import {Newsfeed, NewsfeedSingle} from './src/controllers/newsfeed/newsfeed';
import {Boosts} from './src/controllers/boosts/boosts';
import {Capture} from './src/controllers/capture/capture';
import {Discovery} from './src/controllers/discovery/discovery';
import {Channel, ChannelSubscribers, ChannelSubscriptions} from './src/controllers/channels/channel';
import {Notifications} from './src/controllers/notifications/notifications';
import {Search} from './src/controllers/search/search';
import {Wallet} from './src/controllers/wallet/wallet';
import {Settings} from './src/controllers/settings/settings';
import {Admin} from './src/controllers/admin/admin';
import {Pages} from './src/controllers/pages/pages';

/**
 * TODO: Load these automagically from gulp
 */
import {Gatherings} from './src/plugins/gatherings/gatherings';
import {Blog, BlogView, BlogEdit} from './src/plugins/blog/blog';
import {ArchiveView, ArchiveEdit} from './src/plugins/archive/archive';
import {Groups, GroupsProfile, GroupsCreator} from './src/plugins/groups/groups';

@Component({
  selector: 'minds-app',
  bindings: [ Client, NotificationService, AnalyticsService ],
  templateUrl: './src/controllers/index.html',
  directives: [ CORE_DIRECTIVES, ROUTER_DIRECTIVES, Topbar, SidebarNavigation, SignupModal ]
})
@RouteConfig([
  { path: '/login', component: Login, as: 'Login' },
  { path: '/logout', component: Logout, as: 'Logout' },
  { path: '/register', component: Register, as: 'Register' },
  { path: '/forgot-password', component: ForgotPassword, as: 'Forgot-Password' },

  { path: '/newsfeed', component: Newsfeed, as: 'Newsfeed' },
  { path: '/newsfeed/:guid', component: NewsfeedSingle, as: 'Activity' },
  { path: '/capture', component: Capture, as: 'Capture' },

  { path: '/boosts', component: Boosts, as: 'Boosts' },
  { path: '/boosts/:type', component: Boosts, as: 'Boosts' },
  { path: '/boosts/:type/:filter', component: Boosts, as: 'Boosts' },

  { path: '/discovery/:filter', component: Discovery, as: 'Discovery'},
  { path: '/discovery/:filter/:type', component: Discovery, as: 'Discovery'},

  { path: '/messenger', component:  Gatherings, as: 'Messenger'},
  { path: '/messenger/:guid', component:  Gatherings, as: 'Messenger-Conversation'},

  { path: '/blog/:filter', component:  Blog, as: 'Blog'},
  { path: '/blog/view/:guid', component:  BlogView, as: 'Blog-View'},
  { path: '/blog/view/:guid/:title', component:  BlogView, as: 'Blog-View-Title'},
  { path: '/blog/edit/:guid', component:  BlogEdit, as: 'Blog-Edit'},

  { path: '/archive/view/:guid', component: ArchiveView, as: 'Archive-View'},
  { path: '/archive/edit/:guid', component: ArchiveEdit, as: 'Archive-Edit'},

  { path: '/notifications', component: Notifications, as: 'Notifications'},

  { path: '/groups/:filter', component: Groups, as: 'Groups'},
  { path: '/groups/create', component: GroupsCreator, as: 'Groups-Create'},
  { path: '/groups/profile/:guid', component: GroupsProfile, as: 'Groups-Profile'},
  { path: '/groups/profile/:guid/:filter', component: GroupsProfile, as: 'Groups-Profile'},

  { path: '/wallet', component: Wallet, as: 'Wallet'},
  { path: '/wallet/:filter', component: Wallet, as: 'Wallet-Filter'},

  { path: '/search', component: Search, as: 'Search' },

  { path: '/:username', component: Channel, as: 'Channel' },
  { path: '/:username/:filter', component: Channel, as: 'Channel-Filter' },

  { path: '/settings/:filter', component: Settings, as: 'Settings' },

  { path: '/admin/:filter', component: Admin, as: 'Admin' },

   { path: '/p/:page', component: Pages, as: 'P' },

  { path: '/', component: Homepage, as: 'Homepage' }

])

export class Minds {
  name: string;

  constructor(public notificationService : NotificationService, public analytics : AnalyticsService, public sockets: SocketsService) {
    this.name = 'Minds';

    this.notificationService.getNotifications();
  }

}

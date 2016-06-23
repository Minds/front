import {Component, provide} from '@angular/core';
import {CORE_DIRECTIVES, APP_BASE_HREF} from '@angular/common';
import {bootstrap} from '@angular/platform-browser-dynamic';
import {RouteConfig, Route, Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, ROUTER_PRIMARY_COMPONENT} from '@angular/router-deprecated';
import {HTTP_PROVIDERS} from '@angular/http';

import { MindsRouterOutlet } from './src/directives/router-outlet';

import { NotificationService } from './src/services/notification';
import { AnalyticsService} from './src/services/analytics'
import { Client } from './src/services/api';
import { SocketsService } from './src/services/sockets';

import {Topbar} from './src/components/topbar/topbar';
import {SidebarNavigation} from './src/components/sidebar-navigation/sidebar-navigation';
import {SignupModal} from './src/components/modal/modal';
import {HovercardPopup} from './src/components/hovercard-popup/hovercard-popup';

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
import {Messenger} from './src/plugins/Messenger/messenger';
import {Blog, BlogViewInfinite, BlogEdit} from './src/plugins/blog/blog';
import {ArchiveView, ArchiveEdit} from './src/plugins/archive/archive';
import {Groups, GroupsProfile, GroupsCreator} from './src/plugins/Groups/groups';

@Component({
  selector: 'minds-app',
  providers: [ AnalyticsService ],
  templateUrl: './src/controllers/index.html',
  directives: [ CORE_DIRECTIVES, ROUTER_DIRECTIVES, Topbar, SidebarNavigation, SignupModal, MindsRouterOutlet, HovercardPopup, Messenger  ]
})
@RouteConfig([
  { path: '/login', component: Login, name: 'Login' },
  { path: '/logout', component: Logout, name: 'Logout' },
  { path: '/register', component: Register, name: 'Register' },
  { path: '/forgot-password', component: ForgotPassword, name: 'Forgot-Password' },

  { path: '/newsfeed', component: Newsfeed, name: 'Newsfeed' },
  { path: '/newsfeed/:guid', component: NewsfeedSingle, name: 'Activity' },
  { path: '/capture', component: Capture, name: 'Capture' },

  { path: '/boosts', component: Boosts, name: 'Boosts' },
  { path: '/boosts/:type', component: Boosts, name: 'Boosts' },
  { path: '/boosts/:type/:filter', component: Boosts, name: 'Boosts' },

  { path: '/discovery/:filter', component: Discovery, name: 'Discovery'},
  { path: '/discovery/:filter/:type', component: Discovery, name: 'Discovery'},

  { path: '/blog/:filter', component:  Blog, name: 'Blog'},
  { path: '/blog/view/:guid', component:  BlogViewInfinite, name: 'Blog-View'},
  { path: '/blog/view/:guid/:title', component:  BlogViewInfinite, name: 'Blog-View-Title'},
  { path: '/blog/edit/:guid', component:  BlogEdit, name: 'Blog-Edit'},

  { path: '/archive/view/:guid', component: ArchiveView, name: 'Archive-View'},
  { path: '/archive/edit/:guid', component: ArchiveEdit, name: 'Archive-Edit'},

  { path: '/notifications', component: Notifications, name: 'Notifications'},
  { path: '/notifications/:filter', component: Notifications, name: 'Notifications-Filter'},

  { path: '/groups/:filter', component: Groups, name: 'Groups'},
  { path: '/groups/create', component: GroupsCreator, name: 'Groups-Create'},
  { path: '/groups/profile/:guid', component: GroupsProfile, name: 'Groups-Profile'},
  { path: '/groups/profile/:guid/:filter', component: GroupsProfile, name: 'Groups-Profile'},

  { path: '/wallet', component: Wallet, name: 'Wallet'},
  { path: '/wallet/:filter', component: Wallet, name: 'Wallet-Filter'},

  { path: '/search', component: Search, name: 'Search' },

  { path: '/:username', component: Channel, name: 'Channel' },
  { path: '/:username/:filter', component: Channel, name: 'Channel-Filter' },

  { path: '/settings/:filter', component: Settings, name: 'Settings' },

  { path: '/admin/:filter', component: Admin, name: 'Admin' },

   { path: '/p/:page', component: Pages, name: 'P' },

  { path: '/', component: Homepage, name: 'Homepage' }

])

export class Minds {
  name: string;
  minds = window.Minds;

  constructor(public notificationService : NotificationService, public analytics : AnalyticsService, public sockets: SocketsService) {
    this.name = 'Minds';

    this.notificationService.getNotifications();
  }

}

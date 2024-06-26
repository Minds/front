import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '../../common/common.module';
import { ProService } from './pro.service';
import { ProSubscriptionComponent } from './subscription/subscription.component';
import { ProChannelComponent } from './channel/channel.component';
import { ProChannelLoginComponent } from './channel/login/login.component';
import { MindsFormsModule } from '../forms/forms.module';
import { ProChannelListComponent } from './channel/list/list.component';
import { NewsfeedModule } from '../newsfeed/newsfeed.module';
import { ProChannelFooterComponent } from './channel/footer/footer.component';
import { WireModule } from '../wire/wire.module';
import { VideoModule } from '../media/components/video/video.module';
import { ProCategoriesComponent } from './channel/categories/categories.component';
import { ProChannelContentListComponent } from './channel/content-list/content-list.component';
import { AuthModule } from '../auth/auth.module';
import { ProHamburgerMenu } from './channel/hamburger-menu/hamburger-menu.component';
import { SearchBoxComponent } from './channel/search-box/search-box.component';
import { ForgotPasswordComponent } from '../auth/forgot-password/forgot-password.component';
import { NewsfeedSingleComponent } from '../newsfeed/single/single.component';
import { BlogViewInfinite } from '../blogs/view/infinite';
import { ModalsModule } from '../modals/modals.module';
import { ProRedirectComponent } from './redirect.component';
import { MarketingModule } from '../marketing/marketing.module';
import { JoinButtonComponent } from './channel/join-button/join-button.component';
import { ProChannelSplashComponent } from './channel/splash/splash.component';
import { ActivityModule } from '../newsfeed/activity/activity.module';
import { ProChannelFooterMenuButtonComponent } from './channel/footer-menu-button/footer-menu-button.component';
import { ChannelsV2Module } from '../channels/v2/channels-v2.module';
import { ChannelsV2Service } from '../channels/v2/channels-v2.service';
import { PathMatch } from '../../common/types/angular.types';
import { MarkdownModule } from 'ngx-markdown';
import { MindsOnlyRedirectGuard } from '../../common/guards/minds-only-redirect.guard';

const routes: Routes = [
  {
    path: 'pro',
    children: [
      {
        path: '',
        redirectTo: '/about/pro',
        pathMatch: 'full' as PathMatch,
      },
      {
        path: ':username/settings',
        redirectTo: 'settings/pro_canary/:username',
        pathMatch: 'full' as PathMatch,
      },
      {
        path: ':username',
        component: ProChannelComponent,
        canActivate: [MindsOnlyRedirectGuard],
        children: [
          {
            path: '',
            redirectTo: 'feed',
            pathMatch: 'full' as PathMatch,
          },
          {
            path: 'login',
            component: ProChannelLoginComponent,
          },
          {
            path: 'forgot-password',
            component: ForgotPasswordComponent,
          },
          {
            path: ':type',
            component: ProChannelListComponent,
          },
        ],
      },
    ],
  },
];

export const PRO_DOMAIN_ROUTES: Routes = [
  {
    path: '',
    component: ProChannelComponent,
    canActivate: [MindsOnlyRedirectGuard],
    children: [
      {
        path: '',
        redirectTo: 'feed',
        pathMatch: 'full' as PathMatch,
      },
      {
        path: 'login',
        component: ProChannelLoginComponent,
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
      },
      {
        path: 'newsfeed/:guid',
        component: NewsfeedSingleComponent,
      },
      {
        path: 'media/:guid',
        redirectTo: 'newsfeed/:guid',
      },
      {
        path: 'blog/view/:guid/:title',
        component: BlogViewInfinite,
      },
      {
        path: 'blog/view/:guid',
        component: BlogViewInfinite,
      },
      {
        path: 'blog/:slugid',
        component: BlogViewInfinite,
      },
      {
        path: ':type',
        component: ProChannelListComponent,
      },
      {
        path: 'group/:guid',
        component: ProRedirectComponent,
      },
    ],
  },
];

@NgModule({
  imports: [
    NgCommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(routes),
    MarkdownModule.forRoot(),
    MindsFormsModule,
    NewsfeedModule,
    WireModule,
    VideoModule,
    AuthModule,
    ModalsModule,
    ActivityModule,
    MarketingModule,
    ChannelsV2Module, // Used for footer menu button
  ],
  providers: [ProService, ChannelsV2Service],
  declarations: [
    ProSubscriptionComponent,
    ProCategoriesComponent,
    ProChannelComponent,
    ProChannelLoginComponent,
    ProChannelListComponent,
    ProChannelContentListComponent,
    ProChannelFooterComponent,
    ProHamburgerMenu,
    ProRedirectComponent,
    SearchBoxComponent,
    JoinButtonComponent,
    ProChannelSplashComponent,
    ProChannelFooterMenuButtonComponent,
  ],
  exports: [ProChannelComponent],
})
export class ProModule {}

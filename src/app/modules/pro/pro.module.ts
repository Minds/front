import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '../../common/common.module';
import { ProService } from './pro.service';
import { ProMarketingComponent } from './marketing.component';
import { ProSubscriptionComponent } from './subscription/subscription.component';
import { ProChannelComponent } from './channel/channel.component';
import { ProChannelLoginComponent } from './channel/login/login.component';
import { MindsFormsModule } from '../forms/forms.module';
import { ProChannelListComponent } from './channel/list/list.component';
import { ProTileComponent } from './channel/tiles/media/tile.component';
import { NewsfeedModule } from '../newsfeed/newsfeed.module';
import { ProChannelFooterComponent } from './channel/footer/footer.component';
import { LegacyModule } from '../legacy/legacy.module';
import { WireModule } from '../wire/wire.module';
import { VideoModule } from '../media/components/video/video.module';
import { ProChannelHomeComponent } from './channel/home/home.component';
import { ProChannelHomeCategoryContent } from './channel/home/category-content/category-content.component';
import { ProGroupTileComponent } from './channel/tiles/group/group-tile.component';
import { ProUnsubscribeModalComponent } from './channel/unsubscribe-modal/modal.component';
import { ProCategoriesComponent } from './channel/categories/categories.component';
import { ProChannelContentListComponent } from './channel/content-list/content-list.component';
import { BlogView } from '../blogs/view/view';
import { MediaModalComponent } from '../media/modal/modal.component';
import { AuthModule } from '../auth/auth.module';
import { ProHamburgerMenu } from './channel/hamburger-menu/hamburger-menu.component';
import { SubscribeButtonComponent } from './channel/subscribe-button/subscribe-button.component';
import { SearchBoxComponent } from './channel/search-box/search-box.component';
import { ForgotPasswordComponent } from '../auth/forgot-password/forgot-password.component';
import { NewsfeedSingleComponent } from '../newsfeed/single/single.component';
import { BlogViewInfinite } from '../blogs/view/infinite';
import { CanDeactivateGuardService } from '../../services/can-deactivate-guard';
import { ModalsModule } from '../modals/modals.module';
import { ActivityModule } from '../newsfeed/activity/activity.module';
import { ProRedirectComponent } from './redirect.component';
import { MarketingModule } from '../marketing/marketing.module';
import { JoinButtonComponent } from './channel/join-button/join-button.component';
import { ProChannelSplashComponent } from './channel/splash/splash.component';

const routes: Routes = [
  {
    path: 'pro',
    children: [
      {
        path: '',
        component: ProMarketingComponent,
        data: {
          title: 'Minds Pro',
          description: 'The ultimate platform for creators and brands',
          ogImage: '/assets/product-pages/pro/pro-1.jpg',
          canonicalUrl: '/pro',
          preventLayoutReset: true,
        },
      },
      {
        path: ':username/settings',
        redirectTo: ':username/settings/general',
        pathMatch: 'full',
      },
      {
        path: ':username',
        component: ProChannelComponent,
        children: [
          {
            path: '',
            redirectTo: 'feed',
            pathMatch: 'full',
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

export const PRO_DOMAIN_ROUTES = [
  {
    path: '',
    component: ProChannelComponent,
    children: [
      {
        path: '',
        redirectTo: 'feed',
        pathMatch: 'full',
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
        path: 'groups/profile/:guid',
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
    MindsFormsModule,
    NewsfeedModule,
    LegacyModule,
    WireModule,
    VideoModule,
    AuthModule,
    ModalsModule,
    ActivityModule,
    MarketingModule,
  ],
  providers: [ProService],
  declarations: [
    ProMarketingComponent,
    ProSubscriptionComponent,
    ProTileComponent,
    ProChannelHomeComponent,
    ProCategoriesComponent,
    ProChannelComponent,
    ProChannelLoginComponent,
    ProChannelListComponent,
    ProChannelContentListComponent,
    ProChannelFooterComponent,
    ProChannelHomeCategoryContent,
    ProGroupTileComponent,
    ProUnsubscribeModalComponent,
    ProHamburgerMenu,
    ProRedirectComponent,
    SubscribeButtonComponent,
    SearchBoxComponent,
    JoinButtonComponent,
    ProChannelSplashComponent,
  ],
  exports: [ProChannelComponent],
})
export class ProModule {}

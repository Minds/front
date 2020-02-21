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
import { ProSettingsComponent } from './settings/settings.component';
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
import { MediaViewComponent } from '../media/view/view.component';
import { MediaEditComponent } from '../media/edit/edit.component';
import { BlogViewInfinite } from '../blogs/view/infinite';
import { BlogEdit } from '../blogs/edit/edit';
import { CanDeactivateGuardService } from '../../services/can-deactivate-guard';
import { ModalsModule } from '../modals/modals.module';
import { ActivityModule } from '../newsfeed/activity/activity.module';
import { ProRedirectComponent } from './redirect.component';

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
        },
      },
      {
        path: ':username/settings',
        redirectTo: ':username/settings/general',
        pathMatch: 'full',
      },
      { path: ':username/settings/:tab', component: ProSettingsComponent },
      {
        path: ':username',
        component: ProChannelComponent,
        children: [
          {
            path: '',
            component: ProChannelHomeComponent,
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
        component: ProChannelHomeComponent,
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
        component: MediaViewComponent,
      },
      {
        path: 'media/edit/:guid',
        component: MediaEditComponent,
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
        path: 'blog/edit/:guid',
        component: BlogEdit,
        canDeactivate: [CanDeactivateGuardService],
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
  ],
  providers: [ProService],
  declarations: [
    ProMarketingComponent,
    ProSettingsComponent,
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
  ],
  exports: [ProChannelComponent],
  entryComponents: [
    MediaModalComponent,
    ProUnsubscribeModalComponent,
    BlogView,
    ProRedirectComponent,
  ],
})
export class ProModule {}

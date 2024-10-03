import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '../../common/common.module';
import { ProService } from './pro.service';
import { MindsFormsModule } from '../forms/forms.module';
import { NewsfeedModule } from '../newsfeed/newsfeed.module';
import { WireModule } from '../wire/wire.module';
import { VideoModule } from '../media/components/video/video.module';
import { AuthModule } from '../auth/auth.module';
import { ModalsModule } from '../modals/modals.module';
import { MarketingModule } from '../marketing/marketing.module';
import { ActivityModule } from '../newsfeed/activity/activity.module';
import { ChannelsV2Module } from '../channels/v2/channels-v2.module';
import { ChannelsV2Service } from '../channels/v2/channels-v2.service';
import { PathMatch } from '../../common/types/angular.types';
import { MarkdownModule } from 'ngx-markdown';

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
})
export class ProModule {}

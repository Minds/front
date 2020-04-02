import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OnboardingComponent } from './page/onboarding.component';
import { NoticeStepComponent } from './steps/notice/notice.component';
import { HashtagsStepComponent } from './steps/hashtags/hashtags.component';
import { GroupsStepComponent } from './steps/groups/groups.component';
import { ChannelsStepComponent } from './steps/channels/channels.component';
import { CommonModule as NgCommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '../../common/common.module';
import { TokenOnboardingModule } from '../wallet/tokens/onboarding/onboarding.module';
import { MessengerModule } from '../messenger/messenger.module';
import { SuggestionsModule } from '../suggestions/suggestions.module';
import { HomepageV2Module } from '../homepage-v2/homepage.module';
import { InfoStepComponent } from './steps/info/info.component';
import { ProgressbarComponent } from './progressbar/progressbar.component';
import { ChannelListComponent } from './steps/channels/list/list.component';
import { GroupListComponent } from './steps/groups/list/list.component';
import { MindsFormsModule } from '../forms/forms.module';
import { LegacyModule } from '../legacy/legacy.module';
import { GroupsModule } from '../groups/groups.module';
import { OnboardingV2Service } from './service/onboarding.service';
import { Client } from '../../services/api/client';
import { Session } from '../../services/session';
import { PhoneVerificationComponent } from './steps/info/phone-input/input.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { AvatarStepComponent } from './steps/avatar/avatar.component';

const routes: Routes = [
  {
    path: 'onboarding',
    component: OnboardingComponent,
    children: [
      {
        path: '',
        redirectTo: '/onboarding/notice',
        pathMatch: 'full',
      },
      {
        path: 'notice',
        component: NoticeStepComponent,
      },
      {
        path: 'hashtags',
        component: HashtagsStepComponent,
      },
      {
        path: 'info',
        component: InfoStepComponent,
      },
      {
        path: 'avatar',
        component: AvatarStepComponent,
      },
      {
        path: 'groups',
        component: GroupsStepComponent,
      },
      {
        path: 'channels',
        component: ChannelsStepComponent,
      },
    ],
  },
];

@NgModule({
  imports: [
    NgCommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    CommonModule,
    TokenOnboardingModule,
    MessengerModule,
    SuggestionsModule,
    HomepageV2Module,
    MindsFormsModule,
    LegacyModule,
    GroupsModule,
    ImageCropperModule,
  ],
  exports: [],
  declarations: [
    OnboardingComponent,
    ProgressbarComponent,
    NoticeStepComponent,
    HashtagsStepComponent,
    InfoStepComponent,
    GroupsStepComponent,
    ChannelsStepComponent,
    ChannelListComponent,
    AvatarStepComponent,
    GroupListComponent,
    PhoneVerificationComponent,
  ],
  providers: [
    {
      provide: OnboardingV2Service,
      deps: [Client, Session],
      useFactory: OnboardingV2Service._,
    },
  ],
})
export class OnboardingV2Module {}

import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CaptchaModule } from './modules/captcha/captcha.module';

import { CommonModule } from './common/common.module';
import { I18nModule } from './modules/i18n/i18n.module';

import { AdsModule } from './modules/ads/ads.module';
import { BoostModule } from './modules/boost/boost.module';
import { WireModule } from './modules/wire/wire.module';
import { ReportModule } from './modules/report/report.module';
import { MindsFormsModule } from './modules/forms/forms.module';
import { ModalsModule } from './modules/modals/modals.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { TranslateModule } from './modules/translate/translate.module';
import { OnboardingModule } from './modules/onboarding/onboarding.module';
import { NotificationModule } from './modules/notifications/notification.module';

import { GroupsModule } from './modules/groups/groups.module';
import { PostMenuModule } from './common/components/post-menu/post-menu.module';
import { SearchModule } from './modules/search/search.module';
import { MessengerModule } from './modules/messenger/messenger.module';
import { NewsfeedModule } from './modules/newsfeed/newsfeed.module';
import { MediaModule } from './modules/media/media.module';
import { AuthModule } from './modules/auth/auth.module';
import { BlockchainModule } from './modules/blockchain/blockchain.module';
import { BlockchainMarketingModule } from './modules/blockchain/marketing/marketing.module';
import { BrandingModule } from './modules/branding/branding.module';
import { CommentsModule } from './modules/comments/comments.module';
import { JobsMarketingModule } from './modules/jobs/jobs.module';
import { CodeHighlightModule } from './modules/code-highlight/code-highlight.module';
import { HomepageModule } from './modules/homepage/homepage.module';
import { OnboardingV2Module } from './modules/onboarding-v2/onboarding.module';
import { LayoutModule } from './modules/layout/layout.module';
import { AboutModule } from './modules/about/about.module';
import { CompassModule } from './modules/compass/compass.module';
import { DevToolsModule } from './modules/devtools/devtools.module';
import { SupermindModule } from './modules/supermind/supermind.module';
import { AffiliatesModule } from './modules/affiliates/affiliates.module';
import { GroupModule } from './modules/groups/v2/group.module';
import { MarkdownModule } from 'ngx-markdown';
import { GiftCardModule } from './modules/gift-card/gift-card.module';
import { ValuePropModule } from './modules/value-prop/value-prop.module';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    MarkdownModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    CaptchaModule,
    LayoutModule,
    MindsFormsModule,
    CommonModule,
    AboutModule,
    AdsModule,
    BoostModule,
    WireModule,
    ReportModule,
    I18nModule,
    TranslateModule,
    ModalsModule,
    PaymentsModule,
    OnboardingModule,
    OnboardingV2Module,
    NotificationModule,
    GroupsModule,
    PostMenuModule,
    SearchModule,
    MessengerModule,
    HomepageModule,
    NewsfeedModule,
    MediaModule,
    AuthModule,
    BlockchainModule,
    BlockchainMarketingModule,
    BrandingModule,
    CommentsModule,
    JobsMarketingModule,
    CodeHighlightModule,
    CompassModule,
    DevToolsModule,
    SupermindModule,
    AffiliatesModule,
    GroupModule,
    GiftCardModule,
    ValuePropModule,
  ],
})
export class MindsModule {}

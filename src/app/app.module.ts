import {
  APP_INITIALIZER,
  CUSTOM_ELEMENTS_SCHEMA,
  ErrorHandler,
  NgModule,
} from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CaptchaModule } from './modules/captcha/captcha.module';

import { Minds } from './app.component';

import { MINDS_PROVIDERS } from './services/providers';

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
import { HttpClientModule } from '@angular/common/http';
//import { ChannelContainerModule } from './modules/channel-container/channel-container.module';
import { CodeHighlightModule } from './modules/code-highlight/code-highlight.module';
import { CookieModule } from '@gorniv/ngx-universal';
import { HomepageModule } from './modules/homepage/homepage.module';
import { OnboardingV2Module } from './modules/onboarding-v2/onboarding.module';
import { ConfigsService } from './common/services/configs.service';
import { AppRoutingModule } from './app-routing.module';
import { Pages } from './controllers/pages/pages';
import { LayoutModule } from './modules/layout/layout.module';
import { SharedModule } from './common/shared.module';
import { AboutModule } from './modules/about/about.module';
import { CompassModule } from './modules/compass/compass.module';
import { DevToolsModule } from './modules/devtools/devtools.module';
import { SupermindModule } from './modules/supermind/supermind.module';
import { AffiliatesModule } from './modules/affiliates/affiliates.module';
import { GroupModule } from './modules/groups/v2/group.module';
import { ApolloModule } from 'apollo-angular';
import { MarkdownModule } from 'ngx-markdown';
import { GiftCardModule } from './modules/gift-card/gift-card.module';
import { ValuePropModule } from './modules/value-prop/value-prop.module';
import * as Sentry from '@sentry/angular';
import { Router } from '@angular/router';
import { MindsSentryErrorHandler } from './common/services/diagnostics/sentry-error-handler';

@NgModule({
  bootstrap: [Minds],
  declarations: [Minds, Pages],
  imports: [
    CookieModule.forRoot(),
    ApolloModule,
    MarkdownModule.forRoot(),
    // TransferHttpCacheModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
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
    SharedModule,
    CompassModule,
    DevToolsModule,
    SupermindModule,
    AffiliatesModule,
    GroupModule,
    GiftCardModule,
    ValuePropModule,
    //last due to :username route
    AppRoutingModule,
  ],
  providers: [
    MINDS_PROVIDERS,
    {
      provide: ErrorHandler,
      useExisting: MindsSentryErrorHandler,
    },
    {
      provide: Sentry.TraceService,
      deps: [Router],
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (configs) => () => configs.loadFromRemote(),
      deps: [ConfigsService, Sentry.TraceService],
      multi: true,
    },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MindsModule {}

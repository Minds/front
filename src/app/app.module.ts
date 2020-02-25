import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  Injectable,
  ErrorHandler,
  APP_INITIALIZER,
  APP_BOOTSTRAP_LISTENER,
} from '@angular/core';
import {
  BrowserModule,
  BrowserTransferStateModule,
} from '@angular/platform-browser';
// import { TransferHttpCacheModule } from '@nguniversal/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CaptchaModule } from './modules/captcha/captcha.module';

import { Minds } from './app.component';

import { MINDS_PROVIDERS } from './services/providers';

import { CommonModule } from './common/common.module';
import { MonetizationModule } from './modules/monetization/monetization.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { CheckoutModule } from './modules/checkout/checkout.module';
import { PlusModule } from './modules/plus/plus.module';
import { I18nModule } from './modules/i18n/i18n.module';

import { AdsModule } from './modules/ads/ads.module';
import { BoostModule } from './modules/boost/boost.module';
import { WireModule } from './modules/wire/wire.module';
import { ReportModule } from './modules/report/report.module';
import { ChannelsModule } from './modules/channels/channels.module';
import { MindsFormsModule } from './modules/forms/forms.module';
import { LegacyModule } from './modules/legacy/legacy.module';
import { ModalsModule } from './modules/modals/modals.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ThirdPartyNetworksModule } from './modules/third-party-networks/third-party-networks.module';
import { TranslateModule } from './modules/translate/translate.module';
import { SettingsModule } from './modules/settings/settings.module';
import { OnboardingModule } from './modules/onboarding/onboarding.module';
import { NotificationModule } from './modules/notifications/notification.module';

import { GroupsModule } from './modules/groups/groups.module';
import { PostMenuModule } from './common/components/post-menu/post-menu.module';
import { BanModule } from './modules/ban/ban.module';
import { BlogModule } from './modules/blogs/blog.module';
import { SearchModule } from './modules/search/search.module';
import { MessengerModule } from './modules/messenger/messenger.module';
import { NewsfeedModule } from './modules/newsfeed/newsfeed.module';
import { MediaModule } from './modules/media/media.module';
import { AuthModule } from './modules/auth/auth.module';
import { BlockchainModule } from './modules/blockchain/blockchain.module';
import { BlockchainMarketingModule } from './modules/blockchain/marketing/marketing.module';
import { BrandingModule } from './modules/branding/branding.module';
import { CommentsModule } from './modules/comments/comments.module';
import { NodesMarketingModule } from './modules/nodes/nodes.module';
import { JobsMarketingModule } from './modules/jobs/jobs.module';
import { HelpdeskModule } from './modules/helpdesk/helpdesk.module';
import { MobileModule } from './modules/mobile/mobile.module';
import { IssuesModule } from './modules/issues/issues.module';
import { CanaryModule } from './modules/canary/canary.module';
import { HttpClientModule } from '@angular/common/http';
import { ProModule } from './modules/pro/pro.module';
import { ChannelContainerModule } from './modules/channel-container/channel-container.module';
import { UpgradesModule } from './modules/upgrades/upgrades.module';

import * as Sentry from '@sentry/browser';
import { CookieModule } from '@gorniv/ngx-universal';
import { HomepageModule } from './modules/homepage/homepage.module';
import { OnboardingV2Module } from './modules/onboarding-v2/onboarding.module';
import { ConfigsService } from './common/services/configs.service';
import { AppRoutingModule } from './app-routing.module';
import { Pages } from './controllers/pages/pages';
import { LayoutModule } from './modules/layout/layout.module';

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
  constructor() {}
  handleError(error) {
    // const eventId = Sentry.captureException(error.originalError || error);
    // Sentry.showReportDialog({ eventId });
    console.error(error);
  }
}

@NgModule({
  bootstrap: [Minds],
  declarations: [Minds, Pages],
  imports: [
    BrowserModule.withServerTransition({ appId: 'm-app' }),
    BrowserTransferStateModule,
    CookieModule.forRoot(),
    // TransferHttpCacheModule,
    //BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    CaptchaModule,
    LayoutModule,
    CommonModule,
    ProModule, // NOTE: Pro Module should be declared _BEFORE_ anything else
    WalletModule,
    //CheckoutModule,
    MonetizationModule,
    PlusModule,
    AdsModule,
    BoostModule,
    WireModule,
    ReportModule,
    I18nModule,
    BanModule,
    ThirdPartyNetworksModule,
    LegacyModule,
    TranslateModule,
    SettingsModule,
    ModalsModule,
    PaymentsModule,
    MindsFormsModule,
    OnboardingModule,
    OnboardingV2Module,
    NotificationModule,
    GroupsModule,
    BlogModule,
    PostMenuModule,
    SearchModule,
    MessengerModule,
    HomepageModule,
    NewsfeedModule,
    MediaModule,
    AuthModule,
    BlockchainModule,
    BlockchainMarketingModule,
    NodesMarketingModule,
    BrandingModule,
    CommentsModule,
    JobsMarketingModule,
    HelpdeskModule,
    MobileModule,
    IssuesModule,
    CanaryModule,
    ChannelsModule,
    UpgradesModule,

    //last due to :username route
    AppRoutingModule,
    ChannelContainerModule,
  ],
  providers: [
    { provide: ErrorHandler, useClass: SentryErrorHandler },
    MINDS_PROVIDERS,
    ConfigsService,
    {
      provide: APP_INITIALIZER,
      useFactory: configs => () => configs.loadFromRemote(),
      deps: [ConfigsService],
      multi: true,
    },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MindsModule {}

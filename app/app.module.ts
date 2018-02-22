import { NgModule, enableProdMode, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { CaptchaModule } from './src/modules/captcha/captcha.module';

import { Minds } from './app.component';

import { MindsAppRoutes, MindsAppRoutingProviders, MINDS_APP_ROUTING_DECLARATIONS } from './src/router/app';

import { MINDS_DECLARATIONS } from './src/declarations';
import { MINDS_PLUGIN_DECLARATIONS } from './src/plugin-declarations';
import { MINDS_PROVIDERS } from './src/services/providers';
import { MINDS_PLUGIN_PROVIDERS } from './src/plugin-providers';

import { CommonModule } from './src/common/common.module';
import { MonetizationModule } from './src/modules/monetization/monetization.module';
import { WalletModule } from './src/modules/wallet/wallet.module';
import { CheckoutModule } from './src/modules/checkout/checkout.module';
import { PlusModule } from './src/modules/plus/plus.module';
import { I18nModule } from './src/modules/i18n/i18n.module';

import { AdsModule } from './src/modules/ads/ads.module';
import { BlockchainModule } from './src/modules/blockchain/blockchain.module';
import { BoostModule } from './src/modules/boost/boost.module';
import { WireModule } from './src/modules/wire/wire.module';
import { ReportModule } from './src/modules/report/report.module';
import { ChannelModule } from './src/modules/channel/channel.module';
import { MindsFormsModule } from './src/modules/forms/forms.module';
import { LegacyModule } from './src/modules/legacy/legacy.module';
import { ModalsModule } from './src/modules/modals/modals.module';
import { PaymentsModule } from './src/modules/payments/payments.module';
import { ThirdPartyNetworksModule } from './src/modules/third-party-networks/third-party-networks.module';
import { TranslateModule } from './src/modules/translate/translate.module';
import { VideoModule } from './src/modules/video/video.module';
import { SettingsModule } from './src/modules/settings/settings.module';
import { OnboardingModule } from './src/modules/onboarding/onboarding.module';
import { NotificationModule } from './src/modules/notifications/notification.module';

import { GroupsModule } from './src/modules/groups/groups.module';
import { PostMenuModule } from './src/common/components/post-menu/post-menu.module';
import { BanModule } from './src/modules/ban/ban.module';
import { BlogModule } from './src/modules/blogs/blog.module';
import { SearchModule } from './src/modules/search/search.module';
import { MessengerModule } from './src/modules/messenger/messenger.module';

@NgModule({
  bootstrap: [
    Minds
  ],
  declarations: [
    Minds,
    MINDS_APP_ROUTING_DECLARATIONS,
    MINDS_DECLARATIONS,
    MINDS_PLUGIN_DECLARATIONS,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(MindsAppRoutes),
    CaptchaModule,
    CommonModule,
    WalletModule,
    CheckoutModule,
    MonetizationModule,
    PlusModule,
    AdsModule,
    BlockchainModule,
    BoostModule,
    WireModule,
    ReportModule,
    I18nModule,
    BanModule,
    ThirdPartyNetworksModule,
    LegacyModule,
    TranslateModule,
    VideoModule,
    SettingsModule,
    ModalsModule,
    PaymentsModule,
    MindsFormsModule,
    ChannelModule,
    OnboardingModule,
    NotificationModule,
    GroupsModule,
    BlogModule,
    PostMenuModule,
    SearchModule,
    MessengerModule
  ],
  providers: [
    MindsAppRoutingProviders,
    MINDS_PROVIDERS,
    MINDS_PLUGIN_PROVIDERS,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class MindsModule {
}

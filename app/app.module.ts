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
    MonetizationModule
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

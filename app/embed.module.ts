import { NgModule, enableProdMode, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { Embed } from './embed.component';

import { MindsEmbedRoutes, MindsEmbedRoutingProviders, MINDS_EMBED_ROUTING_DECLARATIONS } from './src/router/embed';
import { MINDS_APP_ROUTING_DECLARATIONS } from './src/router/app';

import { MINDS_DECLARATIONS } from './src/declarations';
import { MINDS_PLUGIN_DECLARATIONS } from './src/plugin-declarations';
import { MINDS_PROVIDERS } from './src/services/providers';
import { MINDS_PLUGIN_PROVIDERS } from './src/plugin-providers';

import { CaptchaModule } from './src/modules/captcha/captcha.module';
import { CommonModule } from './src/common/common.module';
import { LegacyModule } from './src/modules/legacy/legacy.module';
import { VideoModule } from './src/modules/video/video.module';
import { ReportModule } from './src/modules/report/report.module';
import { PostMenuModule } from './src/common/components/post-menu/post-menu.module';
import { BanModule } from './src/modules/ban/ban.module';
import { GroupsModule } from './src/modules/groups/groups.module';
import { BlogModule } from './src/modules/blogs/blog.module';
import { NotificationModule } from './src/modules/notifications/notification.module';

@NgModule({
  bootstrap: [
    Embed
  ],
  declarations: [
    Embed,
    MINDS_APP_ROUTING_DECLARATIONS,
    MINDS_EMBED_ROUTING_DECLARATIONS,
    MINDS_DECLARATIONS,
    MINDS_PLUGIN_DECLARATIONS,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(MindsEmbedRoutes, { initialNavigation: false, useHash: true }),
    CaptchaModule,
    CommonModule,
    LegacyModule,
    VideoModule,
    ReportModule,
    BanModule,
    PostMenuModule,
    GroupsModule,
    BlogModule,
    NotificationModule 
  ],
  providers: [
    MindsEmbedRoutingProviders,
    MINDS_PROVIDERS,
    MINDS_PLUGIN_PROVIDERS,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class EmbedModule {
}

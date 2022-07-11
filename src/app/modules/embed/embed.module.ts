import { FeaturesService } from './../../services/features.service';
import { APP_BASE_HREF, CommonModule, Location } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule, PLATFORM_ID } from '@angular/core';
import {
  BrowserModule,
  BrowserTransferStateModule,
  TransferState,
} from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { CookieModule, CookieService } from '@mindsorg/ngx-universal';
import { MindsHttpClient } from '../../common/api/client.service';
import { BlockListService } from '../../common/services/block-list.service';
import { ConfigsService } from '../../common/services/configs.service';
import { EntitiesService } from '../../common/services/entities.service';
import { RelatedContentService } from '../../common/services/related-content.service';
import { SiteService } from '../../common/services/site.service';
import { Client } from '../../services/api/client';
import { Session } from '../../services/session';
import { Storage } from '../../services/storage';
import { RecentService } from '../../services/ux/recent';
import { VideoModule } from '../media/components/video/video.module';
import { EmbedComponent } from './embed.component';
import { EmbeddedVideoComponent } from './embedded-video/embedded-video.component';
import { ModalService } from '../../services/ux/modal.service';
import { AnalyticsService } from '../../services/analytics';

const routes = [{ path: 'embed/:guid', component: EmbeddedVideoComponent }];

@NgModule({
  declarations: [EmbedComponent, EmbeddedVideoComponent],
  exports: [EmbedComponent],
  imports: [
    CommonModule,
    BrowserModule.withServerTransition({ appId: 'm-app' }),
    BrowserTransferStateModule,
    HttpClientModule,
    VideoModule,
    CookieModule.forRoot(),
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
  ],
  providers: [
    SiteService,
    {
      provide: MindsHttpClient,
      useFactory: MindsHttpClient._,
      deps: [HttpClient, CookieService],
    },
    {
      provide: Client,
      useFactory: Client._,
      deps: [
        HttpClient,
        Location,
        CookieService,
        PLATFORM_ID,
        TransferState,
        'ORIGIN_URL',
      ],
    },
    {
      provide: APP_INITIALIZER,
      useFactory: configs => () => configs.loadFromRemote(),
      deps: [ConfigsService],
      multi: true,
    },
    { provide: APP_BASE_HREF, useValue: '/' },
    ModalService,
    RelatedContentService,
    Session,
    Storage,
    RecentService,
    FeaturesService,
    AnalyticsService,
    {
      provide: BlockListService,
      useFactory: BlockListService._,
      deps: [Client, Session, Storage, RecentService],
    },
    {
      provide: EntitiesService,
      useFactory: EntitiesService._,
      deps: [Client, BlockListService],
    },
  ],
  bootstrap: [EmbedComponent],
})
export class EmbedModule {}

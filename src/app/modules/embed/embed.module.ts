import { APP_BASE_HREF, CommonModule, Location } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  APP_INITIALIZER,
  ErrorHandler,
  NgModule,
  PLATFORM_ID,
} from '@angular/core';
import { TransferState } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { CookieModule, CookieService } from '@gorniv/ngx-universal';
import { SentryErrorHandler } from '../../app.module';
import { MindsHttpClient } from '../../common/api/client.service';
import { ConfigsService } from '../../common/services/configs.service';
import { MetaService } from '../../common/services/meta.service';
import { Client } from '../../services/api/client';
import { VideoModule } from '../media/components/video/video.module';
import { EmbedComponent } from './embed.component';
import { EmbeddedVideoComponent } from './embedded-video/embedded-video.component';

const routes = [{ path: 'embed/:guid', component: EmbeddedVideoComponent }];

@NgModule({
  declarations: [EmbedComponent, EmbeddedVideoComponent],
  exports: [EmbedComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    VideoModule,
    CookieModule.forRoot(),
    RouterModule.forRoot(routes),
  ],
  providers: [
    { provide: ErrorHandler, useClass: SentryErrorHandler },
    MetaService,
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
  ],
  bootstrap: [EmbedComponent],
})
export class EmbedModule {}

import { NgModule, Injectable } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { ServerTransferStateModule } from '@angular/platform-server';
import { XhrFactory } from '@angular/common/http';
import * as xhr2 from 'xhr2';

import { MindsModule } from './app.module';
import { Minds } from './app.component';
import { PlotlyModule } from 'angular-plotly.js';
import { CookieService, CookieBackendService } from '@gorniv/ngx-universal';
import {
  ServerRedirectService,
  RedirectService,
} from './common/services/redirect.service';
import {
  HeadersService,
  ServerHeadersService,
} from './common/services/headers.service';
import { HlsjsPlyrDriver } from './modules/media/components/video-player/hls-driver';
import { DefaultPlyrDriver } from 'ngx-plyr';

PlotlyModule.plotlyjs = {
  react: () => {},
  plot: () => {
    // This simply satisfies the isValid() error
  },
};

// activate cookie for server-side rendering
@Injectable()
export class ServerXhr implements XhrFactory {
  build(): XMLHttpRequest {
    xhr2.prototype._restrictedHeaders.cookie = false;
    return new xhr2.XMLHttpRequest();
  }
}

export const SERVER_PROVIDERS = [
  { provide: XhrFactory, useClass: ServerXhr },
  {
    provide: CookieService,
    useClass: CookieBackendService,
  },
  {
    provide: RedirectService,
    useClass: ServerRedirectService,
  },
  {
    provide: HeadersService,
    useClass: ServerHeadersService,
  },
  {
    provide: HlsjsPlyrDriver,
    useClass: DefaultPlyrDriver,
  },
];

@NgModule({
  imports: [MindsModule, ServerModule, ServerTransferStateModule, PlotlyModule],
  providers: SERVER_PROVIDERS,
  bootstrap: [Minds],
})
export class AppServerModule {}

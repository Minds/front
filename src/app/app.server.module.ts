import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';
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

PlotlyModule.plotlyjs = {
  plot: () => {
    // This simply satisfies the isValid() error
  },
};

// activate cookie for server-side rendering
export class ServerXhr implements XhrFactory {
  build(): XMLHttpRequest {
    xhr2.prototype._restrictedHeaders.cookie = false;
    return new xhr2.XMLHttpRequest();
  }
}

@NgModule({
  imports: [
    MindsModule,
    ServerModule,
    ModuleMapLoaderModule,
    ServerTransferStateModule,
    PlotlyModule,
  ],
  providers: [
    { provide: XhrFactory, useClass: ServerXhr },
    {
      provide: CookieService,
      useClass: CookieBackendService,
    },
    {
      provide: RedirectService,
      useClass: ServerRedirectService,
    },
  ],
  bootstrap: [Minds],
})
export class AppServerModule {}

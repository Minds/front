import { Injectable, NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { XhrFactory } from '@angular/common';
import * as xhr2 from 'xhr2';

import { MindsModule } from './app.module';
import { Minds } from './app.component';
import { PlotlyModule } from 'angular-plotly.js';
import {
  ServerRedirectService,
  RedirectService,
} from './common/services/redirect.service';
import {
  HeadersService,
  ServerHeadersService,
} from './common/services/headers.service';
import { HlsjsPlyrDriver } from './modules/media/components/video-player/hls-driver';
import { DefaultPlyrDriver } from 'ngx-plyr-mg';
import {
  DiagnosticsService,
  ServerDiagnosticsService,
} from './common/services/diagnostics/server-diagnostics.service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { POSTHOG_JS } from './common/services/posthog/posthog-injection-tokens';

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
  { provide: DiagnosticsService, useClass: ServerDiagnosticsService },
  { provide: XhrFactory, useClass: ServerXhr },
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
  {
    provide: POSTHOG_JS,
    useValue: {},
  },
];

@NgModule({
  imports: [
    MindsModule,
    ServerModule,
    PlotlyModule,
    ServiceWorkerModule.register('/ngsw-worker.js', {
      enabled: false,
    }),
  ],
  providers: SERVER_PROVIDERS,
  bootstrap: [Minds],
})
export class AppServerModule {}

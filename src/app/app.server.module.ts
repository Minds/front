import { ErrorHandler, Inject, Injectable, NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { ServerTransferStateModule } from '@angular/platform-server';
import { XhrFactory } from '@angular/common';
import * as xhr2 from 'xhr2';

import { MindsModule } from './app.module';
import { Minds } from './app.component';
import { PlotlyModule } from 'angular-plotly.js';
import { CookieService, CookieBackendService } from '@mindsorg/ngx-universal';
import {
  ServerRedirectService,
  RedirectService,
} from './common/services/redirect.service';
import {
  HeadersService,
  ServerHeadersService,
} from './common/services/headers.service';
import { HlsjsPlyrDriver } from './modules/media/components/video-player/hls-driver';
import { DefaultPlyrDriver } from '@mindsorg/ngx-plyr';
import * as Sentry from '@sentry/node';
import {
  DiagnosticsService,
  ServerDiagnosticsService,
} from './common/services/diagnostics/server-diagnostics.service';
import { SENTRY } from './common/services/diagnostics/diagnostics.service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { POSTHOG_JS } from './common/services/posthog/posthog-injection-tokens';

PlotlyModule.plotlyjs = {
  react: () => {},
  plot: () => {
    // This simply satisfies the isValid() error
  },
};

@Injectable()
export class SentryServerErrorHandler implements ErrorHandler {
  constructor(@Inject(SENTRY) private sentry) {}
  handleError(error: Error) {
    this.sentry.captureException(error);
    //console.error(error);
  }
}

// activate cookie for server-side rendering
@Injectable()
export class ServerXhr implements XhrFactory {
  build(): XMLHttpRequest {
    xhr2.prototype._restrictedHeaders.cookie = false;
    return new xhr2.XMLHttpRequest();
  }
}

export const SERVER_PROVIDERS = [
  { provide: ErrorHandler, useClass: SentryServerErrorHandler },
  { provide: DiagnosticsService, useClass: ServerDiagnosticsService },
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
  {
    provide: POSTHOG_JS,
    useValue: {},
  },
];

@NgModule({
  imports: [
    MindsModule,
    ServerModule,
    ServerTransferStateModule,
    PlotlyModule,
    ServiceWorkerModule.register('/ngsw-worker.js', {
      enabled: false,
    }),
  ],
  providers: SERVER_PROVIDERS,
  bootstrap: [Minds],
})
export class AppServerModule {}

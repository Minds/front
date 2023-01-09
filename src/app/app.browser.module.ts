import { ErrorHandler, Injectable, NgModule } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';

import { MindsModule } from './app.module';
import { Minds } from './app.component';

import { CookieModule } from '@mindsorg/ngx-universal';
import {
  RedirectService,
  BrowserRedirectService,
} from './common/services/redirect.service';
import {
  HeadersService,
  BrowserHeadersService,
} from './common/services/headers.service';
import {
  DiagnosticsService,
  BrowserDiagnosticsService,
} from './common/services/diagnostics/browser-diagnostics.service';
import { environment } from './../environments/environment';

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
  imports: [
    MindsModule,
    ServiceWorkerModule.register('/ngsw-worker.js', {
      enabled: true,
      // Register the ServiceWorker as soon as the app is stable
      // or after 2.5 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:2500',
    }),
    CookieModule,
  ],
  bootstrap: [Minds],
  providers: [
    { provide: ErrorHandler, useClass: SentryErrorHandler },
    { provide: DiagnosticsService, useClass: BrowserDiagnosticsService },
    { provide: 'ORIGIN_URL', useValue: location.origin },
    { provide: 'QUERY_STRING', useValue: location.search || '' },
    {
      provide: RedirectService,
      useClass: BrowserRedirectService,
    },
    {
      provide: HeadersService,
      useClass: BrowserHeadersService,
    },
  ],
})
export class AppBrowserModule {}

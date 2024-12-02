import { ErrorHandler, Injectable, NgModule } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';

import { MindsModule } from './app.module';
import { Minds } from './app.component';

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

import posthog from 'posthog-js';
import { POSTHOG_JS } from './common/services/posthog/posthog-injection-tokens';

@NgModule({
  imports: [
    MindsModule,
    ServiceWorkerModule.register('/ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 2.5 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:2500',
    }),
  ],
  bootstrap: [Minds],
  providers: [
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
    {
      provide: POSTHOG_JS,
      useValue: posthog,
    },
  ],
})
export class AppBrowserModule {}

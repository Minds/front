import {
  ApplicationConfig,
  importProvidersFrom,
  mergeApplicationConfig,
} from '@angular/core';
import { appConfig } from './app.config';
import {
  BrowserRedirectService,
  RedirectService,
} from './common/services/redirect.service';

import posthog from 'posthog-js';
import { POSTHOG_JS } from './common/services/posthog/posthog-injection-tokens';
import { Web3ModalService } from '@mindsorg/web3modal-angular';
import { createWeb3ModalConfig } from './helpers/web3modal-configuration';
import {
  BrowserDiagnosticsService,
  DiagnosticsService,
} from './common/services/diagnostics/browser-diagnostics.service';
import { provideServiceWorker } from '@angular/service-worker';
import { environment } from '../environments/environment';
import {
  BrowserHeadersService,
  HeadersService,
} from './common/services/headers.service';

import * as PlotlyJS from 'plotly.js/dist/plotly-basic.min.js';
import { PlotlyModule } from '@mindsorg/angular-plotly.js';

const browserConfig: ApplicationConfig = {
  providers: [
    { provide: 'ENGINE_URL', useValue: location.origin },

    { provide: DiagnosticsService, useClass: BrowserDiagnosticsService },
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
    {
      provide: Web3ModalService,
      useFactory: () => {
        const config = createWeb3ModalConfig();
        return new Web3ModalService(config);
      },
    },
    importProvidersFrom(PlotlyModule.forRoot(PlotlyJS)),
    provideServiceWorker('/ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 2.5 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:2500',
    }),
  ],
};

export const config = mergeApplicationConfig(appConfig, browserConfig);

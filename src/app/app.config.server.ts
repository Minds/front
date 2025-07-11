import {
  ApplicationConfig,
  importProvidersFrom,
  mergeApplicationConfig,
  REQUEST,
} from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { provideServerRouting, RenderMode } from '@angular/ssr';
import {
  RedirectService,
  ServerRedirectService,
} from './common/services/redirect.service';
import {
  HeadersService,
  ServerHeadersService,
} from './common/services/headers.service';
import { POSTHOG_JS } from './common/services/posthog/posthog-injection-tokens';
import { Web3ModalService } from '@mindsorg/web3modal-angular';
import {
  DiagnosticsService,
  ServerDiagnosticsService,
} from './common/services/diagnostics/server-diagnostics.service';
import { provideServiceWorker } from '@angular/service-worker';

import { PlotlyModule } from '@mindsorg/angular-plotly.js';
import { HTTP_TRANSFER_CACHE_ORIGIN_MAP } from '@angular/common/http';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideServerRouting([
      {
        path: '', // This page is static, so we prerender it (SSG)
        renderMode: RenderMode.Server,
      },
      {
        path: '**',
        renderMode: RenderMode.Server,
      },
    ]),
    { provide: DiagnosticsService, useClass: ServerDiagnosticsService },
    {
      provide: 'ENGINE_URL',
      useFactory: (req: Request) => {
        return 'https://www.minds.com';
        if (!req) {
          return '';
        }

        console.log(req);
        const http =
          req.headers['x-forwarded-proto'] === undefined
            ? 'http'
            : req.headers['x-forwarded-proto'];

        return `${http}://${req.headers.get('host')}`;
      },
      deps: [REQUEST],
    },
    {
      provide: HTTP_TRANSFER_CACHE_ORIGIN_MAP,
      useValue: {
        'https://localhost:4200': 'https://www.minds.com',
        'https://www.minds.com': 'https://localhost:4200',
      },
    },
    importProvidersFrom(
      PlotlyModule.forRoot({
        react: () => {},
        plot: () => {},
      })
    ),
    {
      provide: RedirectService,
      useClass: ServerRedirectService,
    },
    {
      provide: HeadersService,
      useClass: ServerHeadersService,
    },
    {
      provide: POSTHOG_JS,
      useValue: {},
    },
    {
      provide: Web3ModalService,
      useValue: undefined,
    },
    provideServiceWorker('/ngsw-worker.js', { enabled: false }),
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);

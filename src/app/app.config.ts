import {
  ApplicationConfig,
  ErrorHandler,
  inject,
  provideAppInitializer,
} from '@angular/core';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideRouter, Router, withRouterConfig } from '@angular/router';
import { MINDS_PROVIDERS } from './services/providers';
// import { MindsSentryErrorHandler } from './common/services/diagnostics/sentry-error-handler';
import { ConfigsService } from './common/services/configs.service';
import { APOLLO_PROIVDERS } from './common/graphql/apollo-providers';
import routes from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideMarkdown } from 'ngx-markdown';
import { MindsOnlyRedirectGuard } from './common/guards/minds-only-redirect.guard';
import { TenantOnlyRedirectGuard } from './common/guards/tenant-only-redirect.guard';
// import * as Sentry from '@sentry/angular';

export const appConfig: ApplicationConfig = {
  providers: [
    ConfigsService,
    MINDS_PROVIDERS,
    // {
    //   provide: ErrorHandler,
    //   useExisting: MindsSentryErrorHandler,
    // },
    // {
    //   provide: Sentry.TraceService,
    //   deps: [Router],
    // },
    provideAppInitializer(async () => {
      const configs = inject(ConfigsService);
      const res = await configs.loadFromRemote();
      return res;
    }),
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(
      routes,
      withPre
      withRouterConfig({
        onSameUrlNavigation: 'reload',
        // initialNavigation: 'disabled',
      })
    ),
    provideAnimations(),
    provideMarkdown(),
    APOLLO_PROIVDERS,

    //{ provide: APP_BASE_HREF, useValue: '/' },
    MindsOnlyRedirectGuard,
    TenantOnlyRedirectGuard,
  ],
};

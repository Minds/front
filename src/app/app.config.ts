import {
  ApplicationConfig,
  ErrorHandler,
  importProvidersFrom,
  inject,
  provideAppInitializer,
} from '@angular/core';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  provideRouter,
  Router,
  RouterModule,
  withRouterConfig,
} from '@angular/router';
import { MINDS_PROVIDERS } from './services/providers';
// import { MindsSentryErrorHandler } from './common/services/diagnostics/sentry-error-handler';
import { ConfigsService } from './common/services/configs.service';
import { APOLLO_PROIVDERS } from './common/graphql/apollo-providers';
import routes from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideMarkdown } from 'ngx-markdown';
import { MindsOnlyRedirectGuard } from './common/guards/minds-only-redirect.guard';
import { TenantOnlyRedirectGuard } from './common/guards/tenant-only-redirect.guard';
import {
  provideClientHydration,
  withEventReplay,
  withHttpTransferCacheOptions,
} from '@angular/platform-browser';
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
    provideClientHydration(
      withEventReplay(),
      withHttpTransferCacheOptions({
        filter: (req) => {
          console.log(req);
          return true;
        },
      })
    ),

    provideAppInitializer(async () => {
      const configs = inject(ConfigsService);
      const res = await configs.loadFromRemote();
      return res;
    }),
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(
      routes,
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

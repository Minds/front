import { APP_ID } from '@angular/core';
import {
  ImageLoaderConfig,
  IMAGE_CONFIG,
  IMAGE_LOADER,
  DOCUMENT,
} from '@angular/common';
import { Upload } from './api';

import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';

import { CookieHttpInterceptorService } from './api/cookie-http-interceptor.service';
import { CookieService } from '../common/services/cookie.service';
import { MultiFactorHttpInterceptorService } from '../modules/auth/multi-factor-auth/services/multi-factor-http-interceptor.service';
import {
  CDN_ASSETS_URL,
  CDN_URL,
  SITE_URL,
  STRAPI_URL,
} from '../common/injection-tokens/url-injection-tokens';
import { IS_TENANT_NETWORK } from '../common/injection-tokens/tenant-injection-tokens';
import {
  SITE_NAME,
  WINDOW,
} from '../common/injection-tokens/common-injection-tokens';
import { AuthModalHttpInterceptorService } from '../modules/auth/modal/auth-modal-http-interceptor';
import { ConfigsService } from '~/common/services/configs.service';

export const MINDS_PROVIDERS: any[] = [
  { provide: APP_ID, useValue: 'm-app' },
  {
    provide: Upload,
    useFactory: Upload._,
    deps: [HttpClient, CookieService],
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: CookieHttpInterceptorService,
    multi: true,
  },

  {
    provide: HTTP_INTERCEPTORS,
    useClass: MultiFactorHttpInterceptorService,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthModalHttpInterceptorService,
    multi: true,
  },

  {
    provide: CDN_URL,
    useFactory: (configs) => configs.get('cdn_url'),
    deps: [ConfigsService],
  },
  {
    provide: CDN_ASSETS_URL,
    useFactory: (configs) => configs.get('cdn_assets_url'),
    deps: [ConfigsService],
  },
  {
    provide: SITE_URL,
    useFactory: (configs) => configs.get('site_url'),
    deps: [ConfigsService],
  },
  {
    provide: STRAPI_URL,
    useFactory: (configs) => configs.get('strapi')?.url,
    deps: [ConfigsService],
  },
  {
    provide: IS_TENANT_NETWORK,
    useFactory: (configs) => configs.get('is_tenant') ?? false,
    deps: [ConfigsService],
  },
  {
    provide: SITE_NAME,
    useFactory: (configs) => configs.get('site_name') ?? 'Minds',
    deps: [ConfigsService],
  },
  {
    provide: WINDOW,
    useFactory: (_document: Document): Window => _document.defaultView,
    deps: [DOCUMENT],
  },
  {
    provide: IMAGE_CONFIG,
    useValue: {
      // TODO: Customize breakpoints when adding support for width parameter.
      breakpoints: [15360],
    },
  },
  {
    provide: IMAGE_LOADER,
    useValue: (config: ImageLoaderConfig): string => {
      // TODO: server-side support for config.width parameter.
      return config.src;
    },
  },
];

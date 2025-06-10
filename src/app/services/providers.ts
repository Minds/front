import { ApiService } from './../common/api/api.service';
import { ScrollRestorationService } from './scroll-restoration.service';
import { APP_ID, Compiler, NgZone, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import {
  ImageLoaderConfig,
  IMAGE_CONFIG,
  IMAGE_LOADER,
  Location,
} from '@angular/common';
import { TransferState } from '@angular/core';
import { EmbedServiceV2 } from './embedV2.service';

import { ScrollService } from './ux/scroll';
import { SocketsService } from './sockets';
import { Client, Upload } from './api';
import { Storage } from './storage';
import { StorageV2 } from './storage/v2';
import { CacheService } from './cache';
import { TranslationService } from './translation';
import { RichEmbedService } from './rich-embed';
import { Session } from './session';
import { ThirdPartyNetworksService } from './third-party-networks';
import { AnalyticsService } from './analytics';
import { Navigation } from './navigation';
import { AttachmentService } from './attachment';
import { Sidebar } from './ui/sidebar';
import { EmbedService } from './embed.service';
import { CanDeactivateGuardService } from './can-deactivate-guard';
import { LoginReferrerService } from './login-referrer.service';
import { ScrollToTopService } from './scroll-to-top.service';
import { GroupsService } from '../modules/groups/groups.service';

import { GoogleChartsLoader } from './third-party/google-charts-loader';
import { RecentService } from './ux/recent';
import { ContextService } from './context.service';

import { BlockchainService } from '../modules/blockchain/blockchain.service';
import { TimeDiffService } from './timediff.service';
import { UpdateMarkersService } from '../common/services/update-markers.service';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { BlockListService } from '../common/services/block-list.service';
import { EntitiesService } from '../common/services/entities.service';
import { InMemoryStorageService } from './in-memory-storage.service';
import { FeedsService } from '../common/services/feeds.service';
import { ThemeService } from '../common/services/theme.service';
import { GlobalScrollService } from './ux/global-scroll.service';
import { AuthService } from './auth.service';
import { SiteService } from '../common/services/site.service';
import { SessionsStorageService } from './session-storage.service';
import { ToasterService } from '../common/services/toaster.service';
import { ConfigsService } from '../common/services/configs.service';
import { TransferHttpInterceptorService } from './transfer-http-interceptor.service';
import { CookieHttpInterceptorService } from './api/cookie-http-interceptor.service';
import { CookieService } from '../common/services/cookie.service';
import { MessengerService } from '../modules/messenger/messenger.service';
import { MultiFactorHttpInterceptorService } from '../modules/auth/multi-factor-auth/services/multi-factor-http-interceptor.service';
import { CompassHookService } from '../common/services/compass-hook.service';
import { CompassService } from '../modules/compass/compass.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from './ux/modal.service';
import { ServiceWorkerService } from '../common/services/service-worker.service';
import { PushNotificationService } from '../common/services/push-notification.service';
import { DismissalService } from '../common/services/dismissal.service';
import {
  CDN_ASSETS_URL,
  CDN_URL,
  SITE_URL,
  STRAPI_URL,
} from '../common/injection-tokens/url-injection-tokens';
import { APOLLO_PROIVDERS } from '../common/graphql/apollo-providers';
import { IS_TENANT_NETWORK } from '../common/injection-tokens/tenant-injection-tokens';
import {
  SITE_NAME,
  WINDOW,
} from '../common/injection-tokens/common-injection-tokens';
import { DOCUMENT } from '@angular/common';
import { AuthModalHttpInterceptorService } from '../modules/auth/modal/auth-modal-http-interceptor';

export const MINDS_PROVIDERS: any[] = [
  { provide: APP_ID, useValue: 'm-app' },
  SiteService,
  {
    provide: ScrollService,
    useFactory: ScrollService._,
    deps: [],
  },
  {
    provide: GlobalScrollService,
    useFactory: GlobalScrollService._,
    deps: [],
  },
  {
    provide: SocketsService,
    useFactory: (session, nz, configs, platformId) =>
      new SocketsService(session, nz, configs, platformId),
    deps: [Session, NgZone, ConfigsService, PLATFORM_ID],
  },
  {
    provide: Client,
    useFactory: Client._,
    deps: [
      HttpClient,
      Location,
      CookieService,
      PLATFORM_ID,
      TransferState,
      'ORIGIN_URL',
    ],
  },
  {
    provide: Upload,
    useFactory: Upload._,
    deps: [HttpClient, CookieService],
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: TransferHttpInterceptorService,
    multi: true,
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
    provide: Storage,
    useFactory: Storage._,
    deps: [PLATFORM_ID],
  },
  {
    provide: StorageV2,
    useClass: StorageV2,
  },
  {
    provide: SessionsStorageService,
    useFactory: SessionsStorageService._,
    deps: [],
  },
  {
    provide: CacheService,
    useFactory: CacheService._,
    deps: [],
  },
  {
    provide: TranslationService,
    useFactory: TranslationService._,
    deps: [Client, Storage, PLATFORM_ID],
  },
  {
    provide: RichEmbedService,
    useFactory: RichEmbedService._,
    deps: [Client],
  },
  Session,
  ThirdPartyNetworksService,
  AnalyticsService,
  Navigation,
  AttachmentService,
  {
    provide: Sidebar,
    useFactory: Sidebar._,
  },
  EmbedService,
  EmbedServiceV2,
  {
    provide: GoogleChartsLoader,
    useFactory: GoogleChartsLoader._,
    deps: [NgZone],
  },
  {
    provide: CanDeactivateGuardService,
    useFactory: CanDeactivateGuardService._,
  },
  {
    provide: ModalService,
    useFactory: (ngbModal, compiler, platformId) =>
      new ModalService(ngbModal, compiler, platformId),
    deps: [NgbModal, Compiler, PLATFORM_ID],
  },
  {
    provide: LoginReferrerService,
    useFactory: LoginReferrerService._,
    deps: [Session, Router],
  },
  {
    provide: ScrollToTopService,
    useFactory: ScrollToTopService._,
    deps: [Router],
  },
  {
    provide: GroupsService,
    useFactory: GroupsService._,
    deps: [Client, Upload, UpdateMarkersService],
  },
  {
    provide: RecentService,
    useFactory: RecentService._,
    deps: [Storage],
  },
  {
    provide: ContextService,
    useFactory: ContextService._,
    deps: [Router, Storage, Client],
  },
  {
    provide: BlockchainService,
    useFactory: BlockchainService._,
    deps: [Client, Session],
  },
  {
    provide: TimeDiffService,
    useFactory: TimeDiffService._,
  },
  {
    provide: BlockListService,
    useFactory: BlockListService._,
    deps: [Client, Session, Storage, RecentService],
  },
  {
    provide: EntitiesService,
    useFactory: EntitiesService._,
    deps: [Client, BlockListService],
  },
  {
    provide: FeedsService,
    useFactory: FeedsService._,
    deps: [
      Client,
      ApiService,
      Session,
      EntitiesService,
      BlockListService,
      StorageV2,
      Location,
    ],
  },
  {
    provide: InMemoryStorageService,
    useFactory: InMemoryStorageService._,
  },
  {
    provide: CompassHookService,
    useFactory: CompassHookService._,
    deps: [Session, CookieService, CompassService],
  },
  {
    provide: ScrollRestorationService,
    useFactory: (router) => new ScrollRestorationService(router),
    deps: [Router],
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
  ThemeService,
  AuthService,
  ToasterService,
  MessengerService,
  ServiceWorkerService,
  PushNotificationService,
  DismissalService,
  ...APOLLO_PROIVDERS,
];

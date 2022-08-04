import { ApiService } from './../common/api/api.service';
import { ScrollRestorationService } from './scroll-restoration.service';
import { Compiler, NgZone, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location, ViewportScroller } from '@angular/common';
import { TransferState } from '@angular/platform-browser';
import { EmbedServiceV2 } from './embedV2.service';

import { ScrollService } from './ux/scroll';
import { SocketsService } from './sockets';
import { Client, Upload } from './api';
import { Storage } from './storage';
import { StorageV2 } from './storage/v2';
import { SignupModalService } from '../modules/modals/signup/service';
import { CacheService } from './cache';
import { TranslationService } from './translation';
import { RichEmbedService } from './rich-embed';
import { Session } from './session';
import { ThirdPartyNetworksService } from './third-party-networks';
import { AnalyticsService } from './analytics';
import { Navigation } from './navigation';
import { WalletService } from './wallet';
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
import { ApiResource } from '../common/api/api-resource.service';

export const MINDS_PROVIDERS: any[] = [
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
  SignupModalService,
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
  {
    provide: WalletService,
    useFactory: WalletService._,
    deps: [Session, Client, SocketsService, PLATFORM_ID, ConfigsService],
  },
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
    useFactory: (ngbModal, compiler) => new ModalService(ngbModal, compiler),
    deps: [NgbModal, Compiler],
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
    useFactory: router => new ScrollRestorationService(router),
    deps: [Router],
  },
  ThemeService,
  AuthService,
  ToasterService,
  MessengerService,
  ServiceWorkerService,
  PushNotificationService,
  DismissalService,
];

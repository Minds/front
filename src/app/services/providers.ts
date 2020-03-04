import { NgZone, RendererFactory2, PLATFORM_ID, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { TransferState } from '@angular/platform-browser';

import { ScrollService } from './ux/scroll';
import { SocketsService } from './sockets';
import { Client, Upload } from './api';
import { Storage } from './storage';
import { SignupModalService } from '../modules/modals/signup/service';
import { CacheService } from './cache';
import { HovercardService } from './hovercard';
import { TranslationService } from './translation';
import { RichEmbedService } from './rich-embed';
import { Session } from './session';
import { ThirdPartyNetworksService } from './third-party-networks';
import { AnalyticsService } from './analytics';
import { Navigation } from './navigation';
import { WalletService } from './wallet';
import { AttachmentService } from './attachment';
import { Sidebar } from './ui/sidebar';
import { EmbedService } from './embed';
import { CanDeactivateGuardService } from './can-deactivate-guard';
import { OverlayModalService } from './ux/overlay-modal';
import { LoginReferrerService } from './login-referrer.service';
import { ScrollToTopService } from './scroll-to-top.service';
import { GroupsService } from '../modules/groups/groups-service';

import { GoogleChartsLoader } from './third-party/google-charts-loader';
import { RecentService } from './ux/recent';
import { ContextService } from './context.service';
import { FeaturesService } from './features.service';
import { BlockchainService } from '../modules/blockchain/blockchain.service';
import { TimeDiffService } from './timediff.service';
import { UpdateMarkersService } from '../common/services/update-markers.service';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BlockListService } from '../common/services/block-list.service';
import { EntitiesService } from '../common/services/entities.service';
import { InMemoryStorageService } from './in-memory-storage.service';
import { FeedsService } from '../common/services/feeds.service';
import { ThemeService } from '../common/services/theme.service';
import { GlobalScrollService } from './ux/global-scroll.service';
import { AuthService } from './auth.service';
import { SiteService } from '../common/services/site.service';
import { SessionsStorageService } from './session-storage.service';
import { DiagnosticsService } from './diagnostics.service';
import { FormToastService } from '../common/services/form-toast.service';
import { ConfigsService } from '../common/services/configs.service';
import { TransferHttpInterceptorService } from './transfer-http-interceptor.service';
import { CookieHttpInterceptorService } from './api/cookie-http-interceptor.service';
import { CookieService } from '../common/services/cookie.service';
import { RedirectService } from '../common/services/redirect.service';

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
    provide: Storage,
    useFactory: Storage._,
    deps: [],
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
    provide: HovercardService,
    useFactory: HovercardService._,
    deps: [Client, CacheService],
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
  {
    provide: AnalyticsService,
    useFactory: AnalyticsService._,
    deps: [Router, Client, SiteService, PLATFORM_ID],
  },
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
    provide: OverlayModalService,
    useFactory: OverlayModalService._,
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
    provide: FeaturesService,
    useFactory: FeaturesService._,
    deps: [Session, Router, ConfigsService],
  },
  {
    provide: BlockchainService,
    useFactory: BlockchainService._,
    deps: [Client],
  },
  {
    provide: TimeDiffService,
    useFactory: TimeDiffService._,
  },
  {
    provide: BlockListService,
    useFactory: BlockListService._,
    deps: [Client, Session, Storage],
  },
  {
    provide: EntitiesService,
    useFactory: EntitiesService._,
    deps: [Client, BlockListService],
  },
  {
    provide: FeedsService,
    useFactory: FeedsService._,
    deps: [Client, Session, EntitiesService, BlockListService],
  },
  {
    provide: InMemoryStorageService,
    useFactory: InMemoryStorageService._,
  },
  ThemeService,
  DiagnosticsService,
  AuthService,
  FormToastService,
];

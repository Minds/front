import { NgZone, RendererFactory2 } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';

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
import { MindsTitle } from './ux/title';
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
import { WebtorrentService } from '../modules/webtorrent/webtorrent.service';
import { TimeDiffService } from './timediff.service';
import { UpdateMarkersService } from '../common/services/update-markers.service';
import { HttpClient } from '@angular/common/http';
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
    useFactory: SocketsService._,
    deps: [Session, NgZone],
  },
  {
    provide: Client,
    useFactory: Client._,
    deps: [HttpClient, Location],
  },
  {
    provide: Upload,
    useFactory: Upload._,
    deps: [HttpClient],
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
  {
    provide: SignupModalService,
    useFactory: SignupModalService._,
    deps: [Router, ScrollService],
  },
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
    deps: [Client, Storage],
  },
  {
    provide: RichEmbedService,
    useFactory: RichEmbedService._,
    deps: [Client],
  },
  {
    provide: Session,
    useFactory: Session._,
    deps: [SiteService],
  },
  {
    provide: ThirdPartyNetworksService,
    useFactory: ThirdPartyNetworksService._,
    deps: [Client, NgZone],
  },
  {
    provide: AnalyticsService,
    useFactory: AnalyticsService._,
    deps: [Router, Client, SiteService],
  },
  {
    provide: Navigation,
    useFactory: Navigation._,
    deps: [Location],
  },
  {
    provide: WalletService,
    useFactory: WalletService._,
    deps: [Session, Client, SocketsService],
  },
  {
    provide: AttachmentService,
    useFactory: AttachmentService._,
    deps: [Session, Client, Upload, HttpClient],
  },
  {
    provide: Sidebar,
    useFactory: Sidebar._,
  },
  {
    provide: EmbedService,
    useFactory: EmbedService._,
  },
  {
    provide: MindsTitle,
    useFactory: MindsTitle._,
    deps: [Title, SiteService],
  },
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
    deps: [Session, Router],
  },
  {
    provide: BlockchainService,
    useFactory: BlockchainService._,
    deps: [Client],
  },
  {
    provide: WebtorrentService,
    useFactory: WebtorrentService._,
    deps: WebtorrentService._deps,
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
  {
    provide: ThemeService,
    useFactory: ThemeService._,
    deps: [RendererFactory2, Client, Session, Storage],
  },
  DiagnosticsService,
  AuthService,
  FormToastService,
];

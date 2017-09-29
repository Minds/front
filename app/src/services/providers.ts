import { NgZone } from '@angular/core';
import { Http } from '@angular/http';
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
import { NotificationService } from './notification';
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

import { GoogleChartsLoader } from './third-party/google-charts-loader';

export const MINDS_PROVIDERS : any[] = [
   {
     provide: ScrollService,
     useFactory: ScrollService._,
     deps: []
   },
   {
     provide: SocketsService,
     useFactory: SocketsService._,
     deps: [ NgZone ]
   },
   {
     provide: Client,
     useFactory: Client._,
     deps: [ Http ]
   },
   {
     provide: Upload,
     useFactory: Upload._,
     deps: [ Http ]
   },
   {
     provide: Storage,
     useFactory: Storage._,
     deps: []
   },
   {
     provide: SignupModalService,
     useFactory: SignupModalService._,
     deps: [ Router, ScrollService ]
   },
   {
     provide: CacheService,
     useFactory: CacheService._,
     deps: []
   },
   {
     provide: HovercardService,
     useFactory: HovercardService._,
     deps: [ Client, CacheService ]
   },
   {
     provide: NotificationService,
     useFactory: NotificationService._,
     deps: [ Client, SocketsService, MindsTitle ]
   },
   {
     provide: TranslationService,
     useFactory: TranslationService._,
     deps: [ Client, Storage ]
   },
   {
     provide: RichEmbedService,
     useFactory: RichEmbedService._,
     deps: [ Client ]
   },
   {
     provide: Session,
     useFactory: Session._
   },
   {
     provide: ThirdPartyNetworksService,
     useFactory: ThirdPartyNetworksService._,
     deps: [ Client, NgZone ]
   },
   {
     provide: AnalyticsService,
     useFactory: AnalyticsService._,
     deps: [ Router ]
   },
   {
     provide: Navigation,
     useFactory: Navigation._,
     deps: [ Location ]
   },
   {
     provide: WalletService,
     useFactory: WalletService._,
     deps: [ Client, SocketsService ]
   },
   {
     provide: AttachmentService,
     useFactory: AttachmentService._,
     deps: [ Client, Upload ]
   },
   {
     provide: Sidebar,
     useFactory: Sidebar._
   },
   {
     provide: EmbedService,
     useFactory: EmbedService._
   },
   {
     provide: MindsTitle,
     useFactory: MindsTitle._,
     deps: [ Title ]
   },
   {
     provide: GoogleChartsLoader,
     useFactory: GoogleChartsLoader._,
     deps: [ NgZone ]
   },
   {
     provide: CanDeactivateGuardService,
     useFactory: CanDeactivateGuardService._
   },
   {
     provide: OverlayModalService,
     useFactory: OverlayModalService._
   },
   {
     provide: LoginReferrerService,
     useFactory: LoginReferrerService._,
     deps: [ Router ]
   },
   {
     provide: ScrollToTopService,
     useFactory: ScrollToTopService._,
     deps: [ Router ]
   }
];

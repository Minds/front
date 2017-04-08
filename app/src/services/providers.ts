import { NgZone } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { ScrollService } from './ux/scroll';
import { SocketsService } from './sockets';
import { Client, Upload } from './api';
import { Storage } from './storage';
import { GunDB } from './gun';
import { Draft } from './draft';
import { SignupModalService } from '../components/modal/signup/service';
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
     provide: GunDB,
     useFactory: GunDB._,
     deps: []
   },
   {
     provide: Draft,
     useFactory: Draft._,
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
     deps: [ Client, SocketsService ]
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
     deps: [ Client ]
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
     useFactory: MindsTitle._
   },
];

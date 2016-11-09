import { NgZone } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';

import { ScrollService } from './ux/scroll';
import { SocketsService } from './sockets';
import { Client, Upload } from './api';
import { Storage } from './storage';
import { SignupModalService } from '../components/modal/signup/service';
import { CacheService } from './cache';
import { HovercardService } from './hovercard';
import { NotificationService } from './notification';
import { TranslationService } from './translation';
import { RichEmbedService } from './rich-embed';
import { Session } from './session';
import { ThirdPartyNetworksService } from './third-party-networks';
import { AnalyticsService } from './analytics';

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
];

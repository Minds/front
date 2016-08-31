import { provide, NgZone } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router-deprecated';

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
import { ThirdPartyNetworksService } from './third-party-networks';

export const MINDS_PROVIDERS : any[] = [
   provide(ScrollService, {
     useFactory: () => new ScrollService(),
     deps: []
   }),
   provide(SocketsService, {
     useFactory: (nz) => new SocketsService(nz),
     deps: [ NgZone ]
   }),
   provide(Client, {
     useFactory: (http) => new Client(http),
     deps: [ Http ]
   }),
   provide(Upload, {
     useFactory: (http) => new Upload(http),
     deps: [ Http ]
   }),
   provide(Storage, {
     useFactory: () => new Storage(),
     deps: []
   }),
   provide(SignupModalService, {
     useFactory: (router, scroll) => new SignupModalService(router, scroll),
     deps: [ Router, ScrollService ]
   }),
   provide(CacheService, {
     useFactory: () => new CacheService(),
     deps: []
   }),
   provide(HovercardService, {
     useFactory: (client, cache) => new HovercardService(client, cache),
     deps: [ Client, CacheService ]
   }),
   provide(NotificationService, {
     useFactory: (client, sockets) => new NotificationService(client, sockets),
     deps: [ Client, SocketsService ]
   }),
   provide(TranslationService, {
     useFactory: (client, storage) => new TranslationService(client, storage),
     deps: [ Client, Storage ]
   }),
   provide(RichEmbedService, {
     useFactory: (client) => new RichEmbedService(client),
     deps: [ Client ]
   }),
   provide(ThirdPartyNetworksService, {
     useFactory: (client, zone) => new ThirdPartyNetworksService(client, zone),
     deps: [ Client, NgZone ]
   })
];

import { provide } from 'angular2/core';
import { Http } from 'angular2/http';
import { Router } from 'angular2/router';

import { ScrollService } from './ux/scroll';
import { SocketsService } from './sockets';
import { Client, Upload } from './api';
import { SignupModalService } from '../components/modal/signup/service';
import { CacheService } from './cache';
import { HovercardService } from './hovercard';
import { EmojiService } from './emoji';
import { TooltipService } from './tooltip';

export const MINDS_PROVIDERS : any[] = [
   provide(ScrollService, {
     useFactory: () => new ScrollService(),
     deps: []
   }),
   provide(SocketsService, {
     useFactory: () => new SocketsService(),
     deps: []
   }),
   provide(Client, {
     useFactory: (http) => new Client(http),
     deps: [ Http ]
   }),
   provide(Upload, {
     useFactory: (http) => new Upload(http),
     deps: [ Http ]
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
   provide(EmojiService, {
     useFactory: () => new EmojiService(),
     deps: [ ]
   }),
   provide(TooltipService, {
     useFactory: () => new TooltipService(),
     deps: [ ]
   })
];

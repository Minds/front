import { provide } from 'angular2/core';
import { Http } from 'angular2/http';
import { Router } from 'angular2/router';

import { ScrollService } from './ux/scroll';
import { SocketsService } from './sockets';
import { Client, Upload } from './api';
import { SignupModalService } from '../components/modal/signup/service';

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
   })
];

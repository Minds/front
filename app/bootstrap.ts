import {provide, enableProdMode} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';
import {HTTP_PROVIDERS} from 'angular2/http';
import {ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy} from 'angular2/router';
import {SOCKETS_PROVIDERS} from './src/services/sockets';
import {Minds} from './app';

enableProdMode();

bootstrap(Minds, [
  ROUTER_PROVIDERS,
  HTTP_PROVIDERS,
  SOCKETS_PROVIDERS
  //provide(LocationStrategy, { useClass: HashLocationStrategy })
]);

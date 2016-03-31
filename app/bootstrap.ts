///<reference path="../node_modules/angular2/typings/browser.d.ts"/>

import {provide, enableProdMode} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';
import {HTTP_PROVIDERS} from 'angular2/http';
import {ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy} from 'angular2/router';
import {MINDS_PROVIDERS} from './src/services/providers';
import {Minds} from './app';
import {Embed} from './embed';

if ('<%= ENV %>' === 'prod') { enableProdMode(); }

if (window.Minds.MindsContext === 'embed') {
  bootstrap(Embed, [
    ROUTER_PROVIDERS,
    HTTP_PROVIDERS,
    MINDS_PROVIDERS
  ]);
} else {
  bootstrap(Minds, [
    ROUTER_PROVIDERS,
    HTTP_PROVIDERS,
    MINDS_PROVIDERS
    //provide(LocationStrategy, { useClass: HashLocationStrategy })
  ]);
}

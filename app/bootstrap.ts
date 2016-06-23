import {provide, enableProdMode} from '@angular/core';
import {bootstrap} from '@angular/platform-browser-dynamic';
import {HTTP_PROVIDERS} from '@angular/http';
import {ROUTER_PROVIDERS} from '@angular/router-deprecated';
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
  ]);
}

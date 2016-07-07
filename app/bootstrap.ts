import {provide, enableProdMode, PLATFORM_PIPES} from '@angular/core';
import {bootstrap} from '@angular/platform-browser-dynamic';
import {HTTP_PROVIDERS} from '@angular/http';
import {ROUTER_PROVIDERS} from '@angular/router-deprecated';
import {MINDS_PROVIDERS} from './src/services/providers';
import {Minds} from './app';
import {Embed} from './embed';

import {MINDS_PIPES} from './src/pipes/pipes';

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
    MINDS_PROVIDERS,
    provide(PLATFORM_PIPES, {useValue: MINDS_PIPES, multi: true})
  ]);
}

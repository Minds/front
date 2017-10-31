/// <reference path="typings/medium-editor.d.ts" />
/// <reference path="typings/minds.d.ts" />
/// <reference path="../tools/typings/tsd/index.d.ts" />

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { getTranslationProviders } from './src/i18n-providers';
import { MindsModule } from './app.module';
import { EmbedModule } from './embed.module';

if (String('<%= ENV %>') === 'prod') { enableProdMode(); }

getTranslationProviders().then(providers => {
  platformBrowserDynamic().bootstrapModule(
    window.Minds.MindsContext === 'embed' ? EmbedModule : MindsModule,
    { providers }
  );
});


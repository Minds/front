/// <reference path="typings/minds.d.ts" />
/// <reference path="../tools/typings/tsd/index.d.ts" />

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { getTranslationProviders } from './src/i18n-providers';
import { MindsModule } from './minds';

getTranslationProviders().then(providers => {
  platformBrowserDynamic().bootstrapModule(MindsModule, { providers });
});


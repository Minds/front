import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppBrowserModule } from './app/app.browser.module';
import { environment } from './environments/environment';
import { hmrBootstrap } from './hmr';
import { loadTranslations } from '@angular/localize';

if (environment.production) {
  enableProdMode();
}

const getCookie = (name): string => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return (
      parts
        .pop()
        .split(';')
        .shift() || null
    );
  }
};

document.addEventListener('DOMContentLoaded', async () => {
  const languageCode = getCookie('hl');

  if (languageCode) {
    try {
      loadTranslations(
        await fetch(`assets/locale/Minds.${languageCode}.json`)
          .then(r => r.json())
          .then(locale => locale.translations)
      );
    } catch (e) {
      console.warn(`Couldn't load ${languageCode} file`);
    }
  }

  const bootstrap = () =>
    platformBrowserDynamic().bootstrapModule(AppBrowserModule);

  try {
    await bootstrap();
  } catch (e) {
    console.error(e);
  }

  // if (environment.hmr) {
  //   if (module['hot']) {
  //     hmrBootstrap(module, bootstrap);
  //   } else {
  //     console.error('HMR is not enabled for webpack-dev-server!');
  //     console.log('Are you using the --hmr flag for ng serve?');
  //   }
  // } else {
  //   bootstrap().catch(err => console.log(err));
  // }
});

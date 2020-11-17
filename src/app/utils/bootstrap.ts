import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { environment } from '../../environments/environment';
import { hmrBootstrap } from '../../hmr';

if (environment.production) {
  enableProdMode();
}

export default function bootstrap(module: any) {
  document.addEventListener('DOMContentLoaded', async () => {
    const bootstrapModule = () =>
      platformBrowserDynamic().bootstrapModule(module);

    if (environment.hmr) {
      if (module['hot']) {
        hmrBootstrap(module, bootstrapModule);
      } else {
        console.error('HMR is not enabled for webpack-dev-server!');
        console.log('Are you using the --hmr flag for ng serve?');
      }
    } else {
      bootstrapModule().catch(err => console.log(err));
    }
  });
}

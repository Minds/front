import { NgModule } from '@angular/core';

import { MindsModule } from './app.module';
import { Minds } from './app.component';

import { CookieModule } from '@gorniv/ngx-universal';
import {
  RedirectService,
  BrowserRedirectService,
} from './common/services/redirect.service';

@NgModule({
  imports: [MindsModule, CookieModule],
  bootstrap: [Minds],
  providers: [
    { provide: 'ORIGIN_URL', useValue: location.origin },
    { provide: 'QUERY_STRING', useValue: location.search || '' },
    {
      provide: RedirectService,
      useClass: BrowserRedirectService,
    },
  ],
})
export class AppBrowserModule {}

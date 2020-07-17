import { NgModule } from '@angular/core';

import { MindsModule } from './app.module';
import { Minds } from './app.component';

import { CookieModule } from '@gorniv/ngx-universal';
import {
  RedirectService,
  BrowserRedirectService,
} from './common/services/redirect.service';
import {
  HeadersService,
  BrowserHeadersService,
} from './common/services/headers.service';

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
    {
      provide: HeadersService,
      useClass: BrowserHeadersService,
    },
  ],
})
export class AppBrowserModule {}

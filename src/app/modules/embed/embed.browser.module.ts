import { NgModule } from '@angular/core';
import {
  BrowserModule,
  BrowserTransferStateModule,
} from '@angular/platform-browser';
import {
  BrowserHeadersService,
  HeadersService,
} from '../../common/services/headers.service';
import {
  BrowserRedirectService,
  RedirectService,
} from '../../common/services/redirect.service';
import { EmbedComponent } from './embed.component';
import { EmbedModule } from './embed.module';

@NgModule({
  imports: [
    EmbedModule,
    BrowserModule.withServerTransition({ appId: 'm-embed' }),
    BrowserTransferStateModule,
  ],
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
  bootstrap: [EmbedComponent],
})
export class EmbedBrowserModule {}

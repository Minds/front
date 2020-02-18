import { NgModule } from '@angular/core';

import { MindsModule } from './app.module';
import { Minds } from './app.component';

import * as PlotlyJS from 'plotly.js/dist/plotly-basic.min.js';
import { PlotlyModule } from 'angular-plotly.js';
import { CookieModule } from '@gorniv/ngx-universal';
import {
  RedirectService,
  BrowserRedirectService,
} from './common/services/redirect.service';

PlotlyModule.plotlyjs = PlotlyJS;

@NgModule({
  imports: [MindsModule, PlotlyModule, CookieModule],
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

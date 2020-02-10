import { NgModule } from '@angular/core';

import { MindsModule } from './app.module';
import { Minds } from './app.component';

import * as PlotlyJS from 'plotly.js/dist/plotly-basic.min.js';
import { PlotlyModule } from 'angular-plotly.js';
import { CookieModule } from '@gorniv/ngx-universal';

PlotlyModule.plotlyjs = PlotlyJS;

@NgModule({
  imports: [MindsModule, PlotlyModule, CookieModule],
  bootstrap: [Minds],
  providers: [
    { provide: 'ORIGIN_URL', useValue: location.origin },
    { provide: 'QUERY_STRING', useValue: location.search || '' },
  ],
})
export class AppBrowserModule {}

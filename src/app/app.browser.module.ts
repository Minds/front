import { NgModule } from '@angular/core';

import { MindsModule } from './app.module';
import { Minds } from './app.component';

import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import { PlotlyModule } from 'angular-plotly.js';

PlotlyModule.plotlyjs = PlotlyJS;

@NgModule({
  imports: [MindsModule, PlotlyModule],
  bootstrap: [Minds],
  providers: [{ provide: 'ORIGIN_URL', useValue: location.origin }],
})
export class AppBrowserModule {}

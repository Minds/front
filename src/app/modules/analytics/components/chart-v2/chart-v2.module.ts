import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';

import { ChartV2Component } from './chart-v2.component';
import { CommonModule } from '../../../../common/common.module';

import * as PlotlyJS from 'plotly.js/dist/plotly-basic.min.js';
import { PlotlyModule } from 'angular-plotly.js';
PlotlyModule.plotlyjs = PlotlyJS;

@NgModule({
  imports: [NgCommonModule, CommonModule, PlotlyModule],
  declarations: [ChartV2Component],
  exports: [ChartV2Component],
})
export class ChartV2Module {}

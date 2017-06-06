import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TooltipComponent } from './components/tooltip/tooltip.component';
import { FooterComponent } from './components/footer/footer.component';
import { MDL_DIRECTIVES } from "./directives/material";
import { InfiniteScroll } from "./components/infinite-scroll/infinite-scroll";
import { ChartComponent } from "./components/chart/chart.component";


@NgModule({
  imports: [
    NgCommonModule,
    RouterModule
  ],
  declarations: [
    TooltipComponent,
    FooterComponent,
    InfiniteScroll,
    ChartComponent,

    MDL_DIRECTIVES
  ],
  exports: [
    TooltipComponent,
    FooterComponent,
    InfiniteScroll,
    ChartComponent,

    MDL_DIRECTIVES
  ],
  entryComponents: [ ]
})

export class CommonModule {}

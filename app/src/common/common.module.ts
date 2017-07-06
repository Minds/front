import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { TooltipComponent } from './components/tooltip/tooltip.component';
import { FaqComponent } from './components/faq/faq.component';
import { FooterComponent } from './components/footer/footer.component';
import { MDL_DIRECTIVES } from './directives/material';
import { InfiniteScroll } from './components/infinite-scroll/infinite-scroll';
import { ChartComponent } from './components/chart/chart.component';
import { CountryInputComponent } from './components/forms/country-input/country-input.component';
import { DateInputComponent } from './components/forms/date-input/date-input.component';
import { StateInputComponent } from './components/forms/state-input/state-input.component';

@NgModule({
  imports: [
    NgCommonModule,
    RouterModule,
    FormsModule
  ],
  declarations: [
    TooltipComponent,
    FaqComponent,
    FooterComponent,
    InfiniteScroll,
    ChartComponent,
    CountryInputComponent,
    DateInputComponent,
    StateInputComponent,

    MDL_DIRECTIVES
  ],
  exports: [
    TooltipComponent,
    FaqComponent,
    FooterComponent,
    InfiniteScroll,
    ChartComponent,
    CountryInputComponent,
    DateInputComponent,
    StateInputComponent,

    MDL_DIRECTIVES
  ],
  entryComponents: [ ]
})

export class CommonModule {}

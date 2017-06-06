import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TooltipComponent } from './components/tooltip/tooltip.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  imports: [
    NgCommonModule,
    RouterModule
  ],
  declarations: [
    TooltipComponent,
    FooterComponent
  ],
  exports: [
    TooltipComponent,
    FooterComponent
  ],
  entryComponents: [ ]
})

export class CommonModule {}

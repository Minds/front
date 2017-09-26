import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '../../common/common.module';
import { MonetizationOverviewComponent } from './overview.component';


@NgModule({
  imports: [
    NgCommonModule,
    RouterModule,
    CommonModule
  ],
  declarations: [
    MonetizationOverviewComponent,
  ],
  exports: [
    MonetizationOverviewComponent,
  ],
  entryComponents: [ MonetizationOverviewComponent ]
})

export class MonetizationOverviewModule {}

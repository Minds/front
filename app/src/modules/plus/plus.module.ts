import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '../../common/common.module';
import { CheckoutModule } from '../checkout/checkout.module';
import { PlusMarketingComponent } from './marketing.component';

const plusRoutes : Routes = [
  { path: 'plus',  component: PlusMarketingComponent }
]

@NgModule({
  imports: [
    NgCommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    CheckoutModule,
    RouterModule.forChild(plusRoutes)
  ],
  declarations: [
    PlusMarketingComponent,
  ],
  entryComponents: [
    PlusMarketingComponent,
  ]
})

export class PlusModule {}

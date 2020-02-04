import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '../../common/common.module';
import { CheckoutModule } from '../checkout/checkout.module';
import { I18nMarketingComponent } from './marketing.component';

const i18nRoutes: Routes = [
  {
    path: 'localization',
    component: I18nMarketingComponent,
    data: {
      title: 'Localization',
      description: 'Help translate Minds into every global language',
      ogImage: '/assets/photos/satellite.jpg',
    },
  },
];

@NgModule({
  imports: [
    NgCommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    CheckoutModule,
    RouterModule.forChild(i18nRoutes),
  ],
  declarations: [I18nMarketingComponent],
  exports: [],
  entryComponents: [I18nMarketingComponent],
})
export class I18nModule {}

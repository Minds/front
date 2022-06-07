import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '../../common/common.module';
import { I18nMarketingComponent } from './marketing.component';
import { MarketingModule } from '../marketing/marketing.module';

const i18nRoutes: Routes = [
  {
    path: 'localization',
    component: I18nMarketingComponent,
    data: {
      title: 'Localization',
      description: 'Help translate Minds into every global language',
      ogImage: '/assets/photos/night-sky.jpg',
    },
  },
];

@NgModule({
  imports: [
    NgCommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(i18nRoutes),
    MarketingModule,
  ],
  declarations: [I18nMarketingComponent],
  exports: [],
})
export class I18nModule {}

import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {
  FormsModule as NgFormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { CommonModule } from '../../common/common.module';
import { ModalsModule } from '../modals/modals.module';
import { MindsFormsModule } from '../forms/forms.module';

import { BrandingComponent } from './branding.component';
import { MarketingModule } from '../marketing/marketing.module';
import { MindsOnlyRedirectGuard } from '../../common/guards/minds-only-redirect.guard';

const routes: Routes = [
  {
    path: 'branding',
    component: BrandingComponent,
    canActivate: [MindsOnlyRedirectGuard],
    data: {
      title: 'Branding',
      description: 'Logos, assets and styling guides',
      ogImage: '/assets/og-images/branding-v3.png',
      ogImageWidth: 1200,
      ogImageHeight: 1200,
    },
  },
];

@NgModule({
  imports: [
    NgCommonModule,
    RouterModule.forChild(routes),
    NgFormsModule,
    ReactiveFormsModule,
    CommonModule,
    ModalsModule,
    MindsFormsModule,
    MarketingModule,
  ],
  declarations: [BrandingComponent],
})
export class BrandingModule {}

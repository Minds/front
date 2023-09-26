import { NgModule } from '@angular/core';
import {
  CommonModule as NgCommonModule,
  NgOptimizedImage,
} from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '../../common/common.module';
import { HomepageV3Module } from '../homepage-v3/homepage-v3.module';
import { HomepageV3Component } from '../homepage-v3/homepage-v3.component';
import { ProductPageBaseComponent } from './product-pages/components/base/base.component';
import { ProductPageHeroComponent } from './product-pages/components/hero/hero.component';
import { MarkdownModule } from 'ngx-markdown';
import { ProductPagePricingCardsComponent } from './product-pages/components/pricing-cards/pricing-cards.component';
import { ProductPageFeatureTableComponent } from './product-pages/components/feature-table/feature-table.component';
import { ProductPageButtonComponent } from './product-pages/components/common/button/button.component';

const routes: Routes = [
  {
    path: 'about/:slug',
    component: ProductPageBaseComponent,
  },
  {
    path: 'about',
    component: HomepageV3Component,
    data: {
      title: 'About',
      description:
        'Free your mind and get paid for creating content, driving traffic and referring friends. A place to have open conversations and bring people together.',
      canonicalUrl: '/about',
    },
  },
];

@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    RouterModule.forChild(routes),
    HomepageV3Module,
    MarkdownModule.forChild(),
  ],
  declarations: [
    ProductPageBaseComponent,
    ProductPageHeroComponent,
    ProductPagePricingCardsComponent,
    ProductPageFeatureTableComponent,
    ProductPageButtonComponent,
  ],
})
export class AboutModule {}

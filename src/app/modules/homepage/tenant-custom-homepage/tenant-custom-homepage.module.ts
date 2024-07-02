import { NgModule } from '@angular/core';
import {
  CommonModule as NgCommonModule,
  NgOptimizedImage,
} from '@angular/common';
import { CommonModule } from '../../../common/common.module';
import { TenantCustomHomepageBaseComponent } from './components/base/base.component';
import { MarketingModule } from '../../marketing/marketing.module';
import { TenantCustomHomepageHeroComponent } from './components/hero/hero.component';
import { TenantFeaturedGroupCardsComponent } from './components/featured-group-cards/featured-group-cards.component';
import { TenantCustomHomepageMembershipsComponent } from './components/memberships/memberships.component';
import { TenantCustomHomepageAdvertiseComponent } from './components/advertise/advertise.component';

@NgModule({
  imports: [NgCommonModule, CommonModule, NgOptimizedImage, MarketingModule],
  declarations: [
    TenantCustomHomepageBaseComponent,
    TenantCustomHomepageHeroComponent,
    TenantFeaturedGroupCardsComponent,
    TenantCustomHomepageMembershipsComponent,
    TenantCustomHomepageAdvertiseComponent,
  ],
  exports: [TenantCustomHomepageBaseComponent],
})
export class TenantCustomHomepageModule {}

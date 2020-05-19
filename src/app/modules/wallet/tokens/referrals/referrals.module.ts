import { NgModule } from '@angular/core';

import { ReferralsComponent } from './referrals.component';
import { ReferralsDashboardComponent } from './dashboard/dashboard.component';
import { ReferralsLinksComponent } from './links/links.component';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../../../common/common.module';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [NgCommonModule, RouterModule, CommonModule],
  declarations: [
    ReferralsComponent,
    ReferralsDashboardComponent,
    ReferralsLinksComponent,
  ],
  exports: [
    ReferralsComponent,
    ReferralsDashboardComponent,
    ReferralsLinksComponent,
  ],
})
export class ReferralsModule {}

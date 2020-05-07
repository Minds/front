import { NgModule } from '@angular/core';

import { SettingsV2ReferralsComponent } from './referrals.component';
import { SettingsV2ReferralsDashboardComponent } from './dashboard/dashboard.component';
import { SettingsV2ReferralsLinksComponent } from './links/links.component';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../../../common/common.module';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [NgCommonModule, RouterModule, CommonModule],
  declarations: [
    SettingsV2ReferralsComponent,
    SettingsV2ReferralsDashboardComponent,
    SettingsV2ReferralsLinksComponent,
  ],
  exports: [
    SettingsV2ReferralsComponent,
    SettingsV2ReferralsDashboardComponent,
    SettingsV2ReferralsLinksComponent,
  ],
  entryComponents: [
    SettingsV2ReferralsComponent,
    SettingsV2ReferralsDashboardComponent,
    SettingsV2ReferralsLinksComponent,
  ],
})
export class ReferralsV2Module {}

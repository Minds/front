import { NgModule } from '@angular/core';

import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../common/common.module';
import { AffiliatesDescriptionComponent } from './components/description/description.component';
import { AffiliatesComponent } from './containers/affiliates.component';
import { AffiliatesEarningsComponent } from './components/earnings/earnings.component';
import { AffiliatesInviteComponent } from './components/invite/invite.component';
import { AffiliatesShareComponent } from './components/share/share.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [NgCommonModule, CommonModule, RouterModule],
  declarations: [
    AffiliatesComponent,
    AffiliatesDescriptionComponent,
    AffiliatesEarningsComponent,
    AffiliatesInviteComponent,
    AffiliatesShareComponent,
  ],
  exports: [AffiliatesComponent],
})
export class AffiliatesModule {}

import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CommonModule } from '../../common/common.module';
import { TokenOnboardingModule } from '../wallet/tokens/onboarding/onboarding.module';
import { ReportCreatorComponent } from './creator/creator.component';
import { ReportConsoleComponent } from './console/console.component';
import { ReportsContentPolicyComponent } from './content-policy/content-policy.component';
import { JuryDutySessionComponent } from './juryduty/session/session.component';
import { CommentsModule } from '../comments/comments.module';
import { JuryDutySessionListComponent } from './juryduty/session/list.component';
import { JurySessionService } from './juryduty/session/session.service';
import { JuryDutySessionContentComponent } from './juryduty/session/content.component';
import { JuryDutySessionSummonsComponent } from './juryduty/session/summons.component';
import { StrikesComponent } from './strikes/strikes.component';
import { BannedService } from './banned/banned.service';
import { BannedComponent } from './banned/banned.component';
import { ModerationAppealComponent } from './console/appeal.component';
import { MarketingModule } from '../marketing/marketing.module';

@NgModule({
  imports: [
    FormsModule,
    NgCommonModule,
    RouterModule,
    CommonModule,
    CommentsModule,
    MarketingModule,
    RouterModule.forChild([
      //{ path: 'moderation',  redirectTo: '/content-policy' },
      {
        path: 'content-policy',
        component: ReportsContentPolicyComponent,
        data: {
          title: 'Content Policy',
          description:
            'The goal of Minds is to have fair, transparent and ethical moderation practices',
          ogImage: '/assets/og-images/content-policy-v3.png',
          ogImageWidth: 1200,
          ogImageHeight: 1200,
        },
      },
      {
        path: 'moderation/juryduty/:jury',
        component: JuryDutySessionComponent,
      },
      {
        path: 'settings/reported-content/strikes',
        component: StrikesComponent,
      },
      { path: 'moderation/banned', component: BannedComponent },
    ]),
    TokenOnboardingModule,
  ],
  declarations: [
    ReportCreatorComponent,
    ReportConsoleComponent,
    ReportsContentPolicyComponent,
    JuryDutySessionComponent,
    JuryDutySessionListComponent,
    JuryDutySessionContentComponent,
    JuryDutySessionSummonsComponent,
    StrikesComponent,
    BannedComponent,
    ModerationAppealComponent,
  ],
  exports: [ReportConsoleComponent, JuryDutySessionSummonsComponent],
  providers: [JurySessionService, BannedService],
})
export class ReportModule {}

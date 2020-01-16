import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CommonModule } from '../../common/common.module';
import { LegacyModule } from '../legacy/legacy.module';
import { TokenOnboardingModule } from '../wallet/tokens/onboarding/onboarding.module';
import { ReportCreatorComponent } from './creator/creator.component';
import { ReportConsoleComponent } from './console/console.component';
import { ReportsMarketingComponent } from './marketing/marketing.component';
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

@NgModule({
  imports: [
    FormsModule,
    NgCommonModule,
    RouterModule,
    CommonModule,
    LegacyModule,
    CommentsModule,
    RouterModule.forChild([
      //{ path: 'moderation',  redirectTo: '/content-policy' },
      {
        path: 'content-policy',
        component: ReportsMarketingComponent,
        data: {
          title: 'The Jury System',
          description:
            'The goal of Minds is to have fair, transparent and ethical moderation practices',
          ogImage: '/assets/photos/canyon.jpg',
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
    ReportsMarketingComponent,
    JuryDutySessionComponent,
    JuryDutySessionListComponent,
    JuryDutySessionContentComponent,
    JuryDutySessionSummonsComponent,
    StrikesComponent,
    BannedComponent,
    ModerationAppealComponent,
  ],
  exports: [ReportConsoleComponent, JuryDutySessionSummonsComponent],
  entryComponents: [
    ReportCreatorComponent,
    ReportsMarketingComponent,
    JuryDutySessionComponent,
    JuryDutySessionSummonsComponent,
    StrikesComponent,
    BannedComponent,
  ],
  providers: [JurySessionService, BannedService],
})
export class ReportModule {}

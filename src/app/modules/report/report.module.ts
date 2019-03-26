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


@NgModule({
  imports: [
    FormsModule,
    NgCommonModule,
    RouterModule,
    CommonModule,
    LegacyModule,
    CommentsModule,
    RouterModule.forChild([
      { path: 'moderation',  component: ReportsMarketingComponent },
      //{ path: 'moderation/juryduty', redirectTo: '/moderation/juryduty/appeal' },
      { path: 'moderation/juryduty/:jury', component: JuryDutySessionComponent, },
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
  ],
  exports: [
    ReportConsoleComponent
  ],
  entryComponents: [
    ReportCreatorComponent,
    ReportsMarketingComponent,
    JuryDutySessionComponent,
  ],
  providers: [
    JurySessionService,
  ]
})

export class ReportModule {
}

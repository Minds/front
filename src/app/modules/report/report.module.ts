import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CommonModule } from '../../common/common.module';
import { LegacyModule } from '../legacy/legacy.module';
import { ReportCreatorComponent } from './creator/creator.component';
import { ReportConsoleComponent } from './console/console.component';
import { ReportsMarketingComponent } from './marketing/marketing.component';
import { CommentsModule } from '../comments/comments.module';


@NgModule({
  imports: [
    FormsModule,
    NgCommonModule,
    RouterModule,
    CommonModule,
    LegacyModule,
    CommentsModule,
    RouterModule.forChild([
      { path: 'moderation',  component: ReportsMarketingComponent }
    ])
  ],
  declarations: [
    ReportCreatorComponent,
    ReportConsoleComponent,
    ReportsMarketingComponent,
  ],
  exports: [
    ReportConsoleComponent
  ],
  entryComponents: [
    ReportCreatorComponent,
    ReportsMarketingComponent
  ]
})

export class ReportModule {
}

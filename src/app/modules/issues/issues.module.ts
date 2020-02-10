import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReportComponent } from './report/report.component';
import { CommonModule } from '../../common/common.module';

const routes: Routes = [
  {
    path: 'issues/report',
    component: ReportComponent,
    data: {
      title: 'Found a bug?',
      description: 'Report issues with Minds.com',
    },
  },
];

@NgModule({
  declarations: [ReportComponent],
  imports: [RouterModule.forChild(routes), NgCommonModule, CommonModule],
})
export class IssuesModule {}

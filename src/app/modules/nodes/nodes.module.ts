import { NgModule } from '@angular/core';

import { NodesMarketingComponent } from './marketing/marketing.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../common/common.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MarketingModule } from '../marketing/marketing.module';
import { MarkdownModule } from 'ngx-markdown';

const routes: Routes = [
  {
    path: 'nodes',
    component: NodesMarketingComponent,
    data: {
      preventLayoutReset: true,
    },
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    MarkdownModule.forRoot(),
    NgCommonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MarketingModule,
  ],
  declarations: [NodesMarketingComponent],
  exports: [NodesMarketingComponent],
})
export class NodesMarketingModule {}

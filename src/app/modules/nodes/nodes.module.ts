import { NgModule } from '@angular/core';

import { NodesMarketingComponent } from './marketing/marketing.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../common/common.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MarketingModule } from '../marketing/marketing.module';

const routes: Routes = [
  {
    path: 'nodes',
    component: NodesMarketingComponent,
    data: {
      title: 'Minds Nodes',
      description: 'Launch your own social networking app',
      ogImage: '/assets/og-images/nodes.png',
      ogImageWidth: 400,
      ogImageHeight: 76,
    },
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
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

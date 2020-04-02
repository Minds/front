import { NgModule } from '@angular/core';

import { NodesMarketingComponent } from './marketing/marketing.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../common/common.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: 'nodes',
    component: NodesMarketingComponent,
    data: {
      title: 'Minds Nodes',
      description: 'Launch your own social networking app',
      ogImage: '/assets/product-pages/nodes/nodes-1.jpg',
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
  ],
  declarations: [NodesMarketingComponent],
  exports: [NodesMarketingComponent],
  entryComponents: [NodesMarketingComponent],
})
export class NodesMarketingModule {}

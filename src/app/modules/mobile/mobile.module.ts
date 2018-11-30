import { NgModule } from '@angular/core';

import { MobileMarketingComponent } from './marketing/marketing.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../common/common.module';

const routes: Routes = [
  {
    path: 'mobile',
    component: MobileMarketingComponent,
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    NgCommonModule,
    CommonModule,
  ],
  declarations: [
    MobileMarketingComponent
  ],
  exports: [
    MobileMarketingComponent
  ],
  entryComponents: [
    MobileMarketingComponent,
  ]
})

export class MobileModule {
}

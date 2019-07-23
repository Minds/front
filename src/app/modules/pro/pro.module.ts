import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '../../common/common.module';
import { ProService } from './pro.service';
import { ProMarketingComponent } from './marketing.component';
import { ProSubscriptionComponent } from './subscription.component';

const routes: Routes = [
  {
    path: 'pro',
    component: ProMarketingComponent,
  },
];

@NgModule({
  imports: [
    NgCommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(routes),
  ],
  providers: [
    ProService,
  ],
  declarations: [
    ProMarketingComponent,
    ProSubscriptionComponent,
  ],
  exports: [],
  entryComponents: [
    ProMarketingComponent,
  ],
})
export class ProModule {}

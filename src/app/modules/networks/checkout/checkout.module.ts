import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../../common/common.module';
import { RouterModule, Routes } from '@angular/router';
import { NetworksCheckoutBaseComponent } from './components/base/base.component';
import { NetworksCheckoutPageComponent } from './components/checkout-page/checkout-page.component';
import { NetworksCheckoutPlanBuilderComponent } from './components/plan-builder/plan-builder.component';
import { NetworksCheckoutSummaryComponent } from './components/summary/summary.component';
import { NetworksCheckoutSummaryStepperComponent } from './components/summary/stepper/stepper.component';
import { NetworksCheckoutSummaryTimePeriodSelectorComponent } from './components/summary/time-period-selector/time-period-selector.component';
import { MarkdownModule, MARKED_OPTIONS } from 'ngx-markdown';
import { markedOptionsFactory } from '../../../helpers/marked-options-factory';

const routes: Routes = [
  {
    path: '', // '/networks/checkout'
    component: NetworksCheckoutPageComponent,
    data: { preventLayoutReset: true },
  },
];

@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    RouterModule.forChild(routes),
    MarkdownModule.forRoot({
      markedOptions: {
        provide: MARKED_OPTIONS,
        useFactory: markedOptionsFactory({
          anchorTargets: '_blank',
        }),
      },
    }),
  ],
  declarations: [
    NetworksCheckoutPageComponent,
    NetworksCheckoutBaseComponent,
    NetworksCheckoutPlanBuilderComponent,
    NetworksCheckoutSummaryComponent,
    NetworksCheckoutSummaryStepperComponent,
    NetworksCheckoutSummaryTimePeriodSelectorComponent,
  ],
})
export class CheckoutModule {}

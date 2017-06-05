import { NgModule } from '@angular/core';

import { CommonModule } from '../../common/common.module';
import { MonetizationOverviewComponent } from './overview.component';

@NgModule({
  imports: [ CommonModule ],
  declarations: [ MonetizationOverviewComponent ],
  exports: [ MonetizationOverviewComponent ],
  entryComponents: [ MonetizationOverviewComponent ]
})

export class MonetizationModule {}

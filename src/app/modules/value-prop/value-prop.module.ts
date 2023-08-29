import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../common/common.module';
import { ValuePropCardComponent } from './components/card/card.component';
import { ValuePropService } from './services/value-prop.service';
import { ValuePropCardOutletComponent } from './components/outlet/outlet.component';

@NgModule({
  imports: [NgCommonModule, CommonModule],
  declarations: [ValuePropCardComponent, ValuePropCardOutletComponent],
  exports: [ValuePropCardComponent, ValuePropCardOutletComponent],
  providers: [ValuePropService],
})
export class ValuePropModule {}

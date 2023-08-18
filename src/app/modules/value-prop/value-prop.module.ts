import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../common/common.module';
import { ValuePropCardComponent } from './components/card/card.component';
import { ValuePropService } from './services/value-prop.service';

@NgModule({
  imports: [NgCommonModule, CommonModule],
  declarations: [ValuePropCardComponent],
  exports: [ValuePropCardComponent],
  providers: [ValuePropService],
})
export class ValuePropModule {}

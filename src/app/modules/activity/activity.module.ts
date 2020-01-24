import { NgModule } from '@angular/core';
import { MindsActivityV2 } from './activity-v2/activity.component';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../common/common.module';
import { Ng2FittextModule } from 'ng2-fittext';

@NgModule({
  imports: [NgCommonModule, CommonModule, Ng2FittextModule],
  exports: [MindsActivityV2],
  declarations: [MindsActivityV2],
  providers: [],
})
export class NameModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '../../../common/common.module';
import { DiscoveryDisclaimerComponent } from './disclaimer.component';

@NgModule({
  imports: [CommonModule],
  declarations: [DiscoveryDisclaimerComponent],
  exports: [DiscoveryDisclaimerComponent],
})
export class DiscoveryDisclaimerModule {}

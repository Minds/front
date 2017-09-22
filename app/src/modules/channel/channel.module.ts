import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CommonModule } from '../../common/common.module';

import { ChannelModulesComponent } from './modules/modules';

@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    RouterModule.forChild([])
  ],
  declarations: [
    ChannelModulesComponent
  ],
  exports: [
    ChannelModulesComponent
  ]
})
export class ChannelModule {
}

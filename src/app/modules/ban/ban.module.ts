import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CommonModule } from '../../common/common.module';
import { LegacyModule } from '../legacy/legacy.module';
import { BanModalComponent } from './modal/modal.component';


@NgModule({
  imports: [
    FormsModule,
    NgCommonModule,
    RouterModule,
    CommonModule,
    LegacyModule
  ],
  declarations: [
    BanModalComponent
  ],
  exports: [
    BanModalComponent
  ],
  entryComponents: [
    BanModalComponent
  ]
})

export class BanModule {
}

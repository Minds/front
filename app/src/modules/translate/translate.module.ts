import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';

import { CommonModule } from '../../common/common.module';

import { Translate } from './translate';

@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
  ],
  declarations: [
    Translate
  ],
  exports: [
    Translate
  ]
})
export class TranslateModule {
}

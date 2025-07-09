import { CommonModule as NgCommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CommonModule } from '../../common.module';
import { EmojiPickerComponent } from './emoji-picker.component';
import { NgxFloatUiModule } from 'ngx-float-ui';

@NgModule({
  imports: [CommonModule, NgCommonModule, NgxFloatUiModule],
  declarations: [EmojiPickerComponent],
  exports: [EmojiPickerComponent],
})
export class EmojiPickerModule {}

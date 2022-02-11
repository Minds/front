import { CommonModule as NgCommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CommonModule } from '../../common.module';
import { EmojiPickerComponent } from './emoji-picker.component';

@NgModule({
  imports: [CommonModule, NgCommonModule],
  declarations: [EmojiPickerComponent],
  exports: [EmojiPickerComponent],
})
export class EmojiPickerModule {}

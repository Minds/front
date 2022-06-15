import { CommonModule as NgCommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CodeHighlightModule } from '../../../modules/code-highlight/code-highlight.module';
import { CommonModule } from '../../common.module';
import { ReadMoreComponent } from './read-more.component';

@NgModule({
  imports: [NgCommonModule, CommonModule, CodeHighlightModule],
  declarations: [ReadMoreComponent],
  exports: [ReadMoreComponent],
})
export class ReadMoreModule {}

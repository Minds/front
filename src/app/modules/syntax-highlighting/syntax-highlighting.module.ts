import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';

import { CommonModule } from '../../common/common.module';

// import { SyntaxHighlightingPipe } from './syntax-highlighting.pipe';

@NgModule({
  imports: [NgCommonModule, CommonModule],
  // declarations: [SyntaxHighlightingPipe],
  // exports: [SyntaxHighlightingPipe],
})
export class SyntaxHighlightingModule {}

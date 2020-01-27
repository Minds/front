import { NgModule } from '@angular/core';

import { CodeHighlightService } from './code-highlight.service';
import { CodeHighlightPipe } from './code-highlight.pipe';

@NgModule({
  declarations: [CodeHighlightPipe],
  exports: [CodeHighlightPipe],
  providers: [CodeHighlightService],
})
export class CodeHighlightModule {}

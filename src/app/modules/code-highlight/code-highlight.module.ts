import { NgModule } from '@angular/core';

import { CodeHighlightService } from './code-highlight.service';
import { CodeHighlightPipe } from './code-highlight.pipe';
import { CodeHighlightDirective } from './code-highlight.directive';

@NgModule({
  declarations: [CodeHighlightPipe, CodeHighlightDirective],
  exports: [CodeHighlightPipe, CodeHighlightDirective],
  providers: [CodeHighlightService],
})
export class CodeHighlightModule {}

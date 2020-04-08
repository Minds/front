import { Directive, ElementRef, AfterViewInit } from '@angular/core';

import { CodeHighlightService } from './code-highlight.service';
import { FeaturesService } from '../../services/features.service';

/**
 * Directive that searches an HTMLElement's children for <pre><code> blocks to
 * highlight using the CodeHighlightService.
 *
 * Does nothing if `code-highlight` feature is not enabled.
 *
 * @example
 * <div m-code-highlight>
 *  <pre><code class="language-js">console.log('hi');</code></pre>
 * </div>
 *
 * // The inner <code> block will be passed to
 * // CodeHighlightService.highlightBlocks
 *
 * @author Jim Toth <jim@meme.coach>
 */
@Directive({
  selector: '[m-code-highlight]',
})
export class CodeHighlightDirective implements AfterViewInit {
  constructor(
    private element: ElementRef,
    private codeHighlightService: CodeHighlightService,
    private featuresService: FeaturesService
  ) {}

  ngAfterViewInit() {
    if (!this.featuresService.has('code-highlight')) {
      return;
    }

    this.highlightBlocks(
      this.element.nativeElement.querySelectorAll('pre > code')
    );
  }

  highlightBlocks(blocks) {
    for (let i = 0; i < blocks.length; i++) {
      this.codeHighlightService.highlightBlock(blocks[i]);
    }
  }
}

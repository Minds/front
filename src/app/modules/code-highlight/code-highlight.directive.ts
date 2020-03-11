import { Directive, ElementRef, AfterViewInit } from '@angular/core';

import { CodeHighlightService } from './code-highlight.service';
import { FeaturesService } from '../../services/features.service';

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

    this.highlightBlocks(this.element.nativeElement.querySelectorAll('pre'));
  }

  highlightBlocks(blocks) {
    for (let i = 0; i < blocks.length; i++) {
      this.codeHighlightService.highlightBlock(blocks[i]);
    }
  }
}

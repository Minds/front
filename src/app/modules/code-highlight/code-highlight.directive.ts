import { Directive, ElementRef, AfterViewInit } from '@angular/core';
import { CodeHighlightService } from './code-highlight.service';
import { FeaturesService } from '../../services/features.service';

@Directive({
  selector: '[m-code-highlight]',
})
export class CodeHighlightDirective implements AfterViewInit {
  document;

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

    const moduleWrappedNodes = this.element.nativeElement.querySelectorAll(
      `.${CodeHighlightService.moduleWrapperClass}`
    );

    this.highlightBlocks(this.transformModuleWrappedNodes(moduleWrappedNodes));
  }

  transformModuleWrappedNodes(wrappedNodes) {
    for (let i = 0; i < wrappedNodes.length; ++i) {
      const codeNode = document.createElement('code');
      codeNode.appendChild(
        document.createTextNode(wrappedNodes[i].textContent)
      );

      const languageHint = wrappedNodes[i].dataset['language'];

      if (languageHint && languageHint !== 'auto') {
        codeNode.classList.add(`language-${languageHint}`);
      }

      const preNode = document.createElement('pre');
      preNode.appendChild(codeNode);

      while (wrappedNodes[i].firstChild) {
        wrappedNodes[i].firstChild.remove();
      }
      wrappedNodes[i].appendChild(preNode);
    }

    return wrappedNodes;
  }

  highlightBlocks(blocks) {
    for (let i = 0; i < blocks.length; i++) {
      this.codeHighlightService.highlightBlock(blocks[i]);
    }
  }
}

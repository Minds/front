import { Directive, ElementRef, AfterViewInit } from '@angular/core';
import { CodeHighlightService } from './code-highlight.service';
import { codeHighlightWrapperClass } from './code-highlight.util';

@Directive({
  selector: '[m-code-highlight]',
})
export class CodeHighlightDirective implements AfterViewInit {
  document;

  constructor(
    private element: ElementRef,
    private codeHighlightService: CodeHighlightService
  ) {}

  ngAfterViewInit() {
    const codeWrapperNodes = this.element.nativeElement.querySelectorAll(
      `.${codeHighlightWrapperClass}`
    );

    for (let i = 0; i < codeWrapperNodes.length; ++i) {
      const codeNode = document.createElement('code');
      codeNode.appendChild(
        document.createTextNode(codeWrapperNodes[i].textContent)
      );

      const preNode = document.createElement('pre');
      preNode.appendChild(codeNode);

      while (codeWrapperNodes[i].firstChild) {
        codeWrapperNodes[i].firstChild.remove();
      }
      codeWrapperNodes[i].appendChild(preNode);

      this.codeHighlightService.highlightBlock(codeWrapperNodes[i]);
    }
  }
}

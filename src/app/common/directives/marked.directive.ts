// Credit to Jamie Cockrill @ https://www.jamiecockrill.com/2018-04-30-marked-directive/

import { Directive, ElementRef, Renderer2 } from '@angular/core';
import * as marked from 'marked';

/**
 * Convert the contents of the decorated element from Markdown into HTML.
 *
 * Usage:
 * <div mMarkdown>
 * # I am a header!
 *
 * I am a paragraph!
 * </div>
 * ```
 */
@Directive({
  selector: '[mMarkdown]',
})
export class MarkedDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {
    setTimeout(() => {
      this.parse();
    });
  }

  parse(): void {
    // deliberate use of innerHTML because we might have HTML
    // and markdown mixed together
    const markText = this.el.nativeElement.innerHTML;
    if (markText && markText.length > 0) {
      const markdownHtml = marked(markText);
      this.renderer.setProperty(
        this.el.nativeElement,
        'innerHTML',
        markdownHtml
      );
    }
  }
}

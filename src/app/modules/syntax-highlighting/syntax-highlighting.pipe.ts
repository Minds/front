import { Pipe, Inject, PipeTransform } from '@angular/core';

import hljs from 'highlight.js';

@Pipe({
  name: 'syntaxHighlighting',
})

/**
 * Code Syntax Highlighting Pipe
 */
export class SyntaxHighlightingPipe implements PipeTransform {
  transform(value: string): string {
    // TODO -> 1) regex search on ```language ```
    const lang = 'javascript';

    const res = hljs.highlight(lang, value, true);

    // TODO -> 2) replace code syntax block with res.value
    return `${res.value}`;
  }
}

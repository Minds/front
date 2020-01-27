import { Pipe, PipeTransform } from '@angular/core';
import { CodeHighlightService } from './code-highlight.service';

@Pipe({
  name: 'codeHighlight',
})
export class CodeHighlightPipe implements PipeTransform {
  result: string = '';

  constructor(private codeHighlightService: CodeHighlightService) {}

  transform(text: string): string {
    let language: string;

    const transformed = text.replace(
      /```(\w+)(.*)```/gims,
      (match, lang, code) => {
        language = lang;

        return `<pre><code class="${lang}">${this.codeHighlightService.highlight(
          language,
          code
        )}</code></pre>`;
      }
    );

    if (language) {
      return transformed;
    }

    return text;
  }
}

import { Pipe, PipeTransform } from '@angular/core';
import { CodeHighlightService } from './code-highlight.service';

@Pipe({
  name: 'codeHighlight',
})
export class CodeHighlightPipe implements PipeTransform {
  result: string = '';

  constructor(private codeHighlightService: CodeHighlightService) {}

  transform(text: string, noWrap: boolean): string {
    if (!text) {
      return text;
    }

    let language: string;

    const transformed = text.replace(
      /```(\w+)(.*)```/gims,
      (match, lang, code) => {
        language = lang;

        if (noWrap) {
          return this.codeHighlightService.highlight(language, code).value;
        }

        return `<pre><code class="${lang}">${
          this.codeHighlightService.highlight(language, code).value
        }</code></pre>`;
      }
    );

    if (language) {
      return transformed;
    }

    return text;
  }
}

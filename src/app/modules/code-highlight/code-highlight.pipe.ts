import { Pipe, PipeTransform } from '@angular/core';
import { CodeHighlightService } from './code-highlight.service';

@Pipe({
  name: 'codeHighlight',
})
export class CodeHighlightPipe implements PipeTransform {
  result: string = '';

  constructor(private codeHighlightService: CodeHighlightService) {}

  transform(text: string): string {
    if (!text) {
      return text;
    }

    let language: string;

    const transformed = text.replace(
      /```(\w+)?\s(.*)```/gims,
      (match, lang, code) => {
        language = lang;

        let highlighted;

        if (lang && lang !== 'auto') {
          highlighted = this.codeHighlightService.highlight(lang, code).value;
        } else {
          const highlightResult = this.codeHighlightService.highlightAuto(code);
          language = highlightResult.language;
          highlighted = highlightResult.value;
        }

        return `<pre><code class="language-${language}">${highlighted}</code></pre>`;
      }
    );

    if (language) {
      return transformed;
    }

    return text;
  }
}

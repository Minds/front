import { Pipe, PipeTransform } from '@angular/core';

import { CodeHighlightService } from './code-highlight.service';
import { FeaturesService } from '../../services/features.service';

@Pipe({
  name: 'codeHighlight',
})
export class CodeHighlightPipe implements PipeTransform {
  constructor(
    private codeHighlightService: CodeHighlightService,
    private featuresService: FeaturesService
  ) {}

  transform(text: string): string {
    if (!text || !this.featuresService.has('code-highlight')) {
      return text;
    }

    const codeFenceRegex = /```(\w+)?[\s\n]((?:(?!```).|\n)*)```/gm;
    let language: string;

    const transformed = text.replace(codeFenceRegex, (match, lang, code) => {
      language = lang;

      let highlighted;

      if (lang && lang !== 'auto') {
        highlighted = this.codeHighlightService.highlight(lang, code).value;
      } else {
        const highlightResult = this.codeHighlightService.highlightAuto(code);
        language = highlightResult.language;
        highlighted = highlightResult.value;
      }

      return (
        `<div class="${CodeHighlightService.moduleWrapperClass}">` +
        `<pre><code class="language-${language}">${highlighted}</code></pre>` +
        `</div>`
      );
    });

    if (language) {
      return transformed;
    }

    return text;
  }
}

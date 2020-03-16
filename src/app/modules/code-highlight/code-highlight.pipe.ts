import { Pipe, PipeTransform } from '@angular/core';

import { CodeHighlightService } from './code-highlight.service';
import { FeaturesService } from '../../services/features.service';

/**
 * Pipe that replaces code fences with <pre><code> and highlights code syntax
 * using CodeHighlightService.
 *
 * The pipe takes a language hint from the code fences it detects and sets
 * the <code> block's class using this information. If no language hint is
 * present or a language is not supported then automatic code highlighting
 * will be used.
 *
 * Does nothing if `code-highlight` feature is not enabled.
 *
 * @example
 * const input = '```js console.log(\'hi\');```';
 * const transformed = codeHighlightPipe.transform(input);
 * // transformed is:
 * // '<pre><code class="language-js">console.log(\'hi\');</code></pre>'
 *
 * @example
 * const input = '``` echo \'hi\';```;
 * const transformed = codeHighlightPipe.transform(input);
 * // Highlight.js detects language as PHP.
 * // transformed is:
 * // '<pre><code class="language-php">echo \'hi\';</code></pre>'
 *
 * @author Jim Toth <jim@meme.coach>
 */
@Pipe({
  name: 'codeHighlight',
})
export class CodeHighlightPipe implements PipeTransform {
  constructor(
    private codeHighlightService: CodeHighlightService,
    private featuresService: FeaturesService
  ) {}

  /**
   * Transforms a string by replacing code fences with <pre><code> blocks and
   * highlights the contents.
   *
   * Does nothing if `code-highlight` feature is not enabled.
   *
   * @param {string} text
   * @returns {string} Transformed string, or the original text if feature is
   * not enabled
   */
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

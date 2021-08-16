import { Injectable } from '@angular/core';

import hljs from 'highlight.js';

/**
 * Relevant output from Highlight.js methods
 */
export type CodeHighlightResult = {
  value: string;
  language?: string;
};

/**
 * Simple proxy service for the Highlight.js library.
 *
 * Passes back unchanged input in highlight* methods if Highlight.js is not
 * available.
 *
 * @author Jim Toth <jim@meme.coach>
 */
@Injectable()
export class CodeHighlightService {
  static moduleWrapperClass: string = 'm-code-highlight';

  /**
   * Uses Highlight.js to highlight code. If the requested language is not
   * supported, uses highlightAuto() instead.
   *
   * @param {string} lang The language to highlight with
   * @param {string} code The code to highlight
   */
  highlight(lang: string, code: string): CodeHighlightResult {
    if (this.getLanguages().indexOf(lang) < 0) {
      return this.highlightAuto(code);
    } else if (hljs) {
      return hljs.highlight(lang, code, true);
    }

    return { value: code };
  }

  /**
   * Uses Highlight.js to detect the language for this code sample
   *
   * @param {string} code The code to automatically highlight
   * @returns {CodeHighlightResult} With automatically detected 'language' property
   */
  highlightAuto(code: string): CodeHighlightResult {
    if (hljs) {
      return hljs.highlightAuto(code);
    }

    return { value: code };
  }

  /**
   * Uses Highlight.js to highlight a <code> block. Recursively highlights
   * children.
   *
   * @param {Element} codeNode HTML element to highlight code blocks
   */
  highlightBlock(codeNode: HTMLElement) {
    if (hljs) {
      hljs.highlightBlock(codeNode);
    }
  }

  /**
   * Returns an array of languages that Highlight.js supports.
   *
   * @returns {string[]} An array of languages Highlight.js supports
   */
  getLanguages(): string[] {
    if (hljs) {
      return hljs.listLanguages();
    }

    return [];
  }
}

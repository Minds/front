import { Injectable } from '@angular/core';

import hljs from 'highlight.js';

export interface ICodeHighlightResult {
  value: string;
  language?: string;
}

@Injectable()
export class CodeHighlightService {
  static moduleWrapperClass: string = 'm-code-highlight';

  highlight(lang: string, code: string): ICodeHighlightResult {
    if (this.getLanguages().indexOf(lang) < 0) {
      return this.highlightAuto(code);
    } else if (hljs) {
      return hljs.highlight(lang, code, true);
    }

    return { value: code };
  }

  highlightAuto(code: string): ICodeHighlightResult {
    if (hljs) {
      return hljs.highlightAuto(code);
    }

    return { value: code };
  }

  highlightBlock(codeNode: Element) {
    if (hljs) {
      hljs.highlightBlock(codeNode);
    }
  }

  getLanguages(): string[] {
    if (hljs) {
      return hljs.listLanguages();
    }

    return [];
  }
}

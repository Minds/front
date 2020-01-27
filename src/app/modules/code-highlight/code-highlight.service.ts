import { Injectable } from '@angular/core';

import hljs from 'highlight.js';

@Injectable()
export class CodeHighlightService {
  highlight(lang: string, code: string): string {
    if (hljs && hljs.listLanguages().indexOf(lang) > -1) {
      return hljs.highlight(lang, code, true).value;
    } else {
      return code;
    }
  }
}

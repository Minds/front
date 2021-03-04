import { Pipe, Inject, PipeTransform } from '@angular/core';
import { FeaturesService } from '../../services/features.service';
import { SiteService } from '../services/site.service';
import { RegexService } from '../services/regex.service';

@Pipe({
  name: 'tags',
})

/**
 * Tags pipe
 */
export class TagsPipe implements PipeTransform {
  results = [];

  /**
   * Tags
   */
  tags = {
    url: {
      rule: this.regexService.getRegex('url'),
      replace: m => {
        return `<a href="${m.match[1]}" target="_blank" rel="noopener nofollow ugc">${m.match[1]}</a>`;
      },
    },
    mail: {
      rule: this.regexService.getRegex('mail'),
      replace: m => {
        return `<a href="mailto:${m.match[0]}" target="_blank" rel="noopener nofollow ugc">${m.match[0]}</a>`;
      },
    },
    hash: {
      rule: this.regexService.getRegex('hash'),
      replace: m => {
        if (this.siteService.isProDomain) {
          return `${
            m.match[1]
          }<a href="/all;query=${m.match[2].toLowerCase()}">#${m.match[2]}</a>`;
        }
        return `${
          m.match[1]
        }<a href="/discovery/search?f=top&t=all&q=%23${m.match[2].toLowerCase()}" class="m-legible">#${
          m.match[2]
        }</a>`; // TODO: make these link locally
      },
    },
    at: {
      rule: this.regexService.getRegex('at'),
      replace: m => {
        return `${m.match[1]}<a class="tag" href="/${m.match[2]}" target="_blank">@${m.match[2]}</a>`;
      },
    },
  };

  constructor(
    private featureService: FeaturesService,
    private siteService: SiteService,
    public regexService: RegexService
  ) {}

  /**
   * Push a match to results array
   * @param match
   */
  push(match: any) {
    // ignore match inside others
    if (
      this.results.findIndex(
        m => match.start >= m.start && match.end <= m.end
      ) !== -1
    ) {
      return;
    }
    this.results.push(match);
  }

  /**
   * Parse tags
   * @param tag
   * @param value
   */
  parse(tag: string, value: string) {
    let match;
    while ((match = this.tags[tag].rule.exec(value)) !== null) {
      this.push({
        type: tag,
        start: match.index,
        end: match.index + match[0].length,
        match: match,
      });
    }
  }

  /**
   * Replace tags
   * @param str
   */
  replace(str) {
    this.results.forEach(m => {
      str = str.replace(m.match[0], this.tags[m.type].replace(m, str));
    });

    return str;
  }

  transform(value: string): string {
    this.results = [];
    // Order is important. Url and Mail first, then smaller matches (hash and at).
    this.parse('url', value);
    this.parse('mail', value);
    this.parse('hash', value);
    this.parse('at', value);

    if (this.results.length === 0) {
      return value;
    }
    /* Sort by the start points and then build the string by pushing the individual string segments onto an array,
     then joining it at the end to avoid a chain of string concatenations. (O=n^2) */
    this.results.sort((a, b) => a.start - b.start);
    let html = [];
    let copyStartIndex = 0;

    for (let i = 0; i < this.results.length; i++) {
      let tag = this.results[i];
      html.push(value.substring(copyStartIndex, tag.start));
      html.push(this.tags[tag.type].replace(tag));
      copyStartIndex = tag.end;
      if (i == this.results.length - 1) {
        html.push(value.substring(copyStartIndex));
      }
    }
    return html.join('');
  }
}

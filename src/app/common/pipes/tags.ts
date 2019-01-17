import { Pipe, Inject, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tags'
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
      rule: /(\b(https?|ftp|file):\/\/[^\s\]]+)/gim,
      replace: (m) => {
        return `<a href="${m.match[1]}" target="_blank" rel="noopener noreferrer">${m.match[1]}</a>`;
      }
    },
    mail: {
      rule: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gim,
      replace: (m) => {
        return `<a href="mailto:${m.match[0]}" target="_blank" rel="noopener noreferrer">${m.match[0]}</a>`;
      }
    },
    hash: {
      rule: /#\w+/gim,
      // rule: /(^|\s||)#(\w+)/gim,
      replace: (m) => {
        return `<a href="/newsfeed/tag/${m.match[0].substring(1)};ref=hashtag" target="_blank">${m.match[0]}</a>`;
      }
    },
    at: {
      rule: /(^|\s|\W)@(\w*[a-zA-Z_-]+\w*)/gim,
      replace: (m) => {
        return `${m.match[1]}<a class="tag" href="/${m.match[2]}" target="_blank">@${m.match[2]}</a>`;
      }
    }
  };

  /**
   * Push a match to results array
   * @param match
   */
  push(match: any) {
    // ignore match inside others
    if (this.results.findIndex(m => match.start >= m.start && match.end <= m.end) !== -1) {
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
        match: match
      });
    }
  }

  transform(value: string): string {
    this.results = [];
    this.parse('url', value);
    this.parse('mail', value);
    this.parse('hash', value);
    this.parse('at', value);

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

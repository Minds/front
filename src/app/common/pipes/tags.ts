import { Pipe, PipeTransform } from '@angular/core';
import { SiteService } from '../services/site.service';
import { RegexService } from '../services/regex.service';
import { TextParserService } from '../services/text-parser.service';

// type of tag.
export type TagType = 'url' | 'mail' | 'hash' | 'cash' | 'at';

// object used to store match for a tag.
export type TagMatch = {
  type: TagType; // type of tag e.g. url, mail...
  start: number; // start index.
  end: number; // end index.
  match: string[]; // array of match(es).
};

// helper structure to keep things tidy.
export type TagHelpers = {
  [key in TagType]: {
    rule?: RegExp;
    replace: Function;
  };
};

/**
 * Tags pipe - pipe to handle the mapping of text to corresponding urls,
 * hashtags, cashtags, usernames etc.
 */
@Pipe({
  name: 'tags',
})
export class TagsPipe implements PipeTransform {
  results = [];

  /**
   * Tags
   */
  private tags: TagHelpers = {
    url: {
      // @deprecated - regex matching superseded by twitter-text lib.
      // rule: this.regexService.getRegex('url'),
      replace: (m: TagMatch) => {
        let url = m.match[0];

        // make sure links with no protocol specified are interpreted as external.
        if (!url.startsWith('http')) {
          url = `//${url}`;
        }

        return `<a href="${url}" target="_blank" rel="${this.siteService.getLinkRel(
          url
        )}">${m.match[0]}</a>`;
      },
    },
    mail: {
      rule: this.regexService.getRegex('mail'),
      replace: (m: TagMatch) => {
        const url = m.match[0];
        return `<a href="mailto:${url}" target="_blank">${m.match[0]}</a>`;
      },
    },
    hash: {
      rule: this.regexService.getRegex('hash'),
      replace: (m: TagMatch) => {
        return `${
          m.match[1]
        }<a href="/discovery/search?f=top&t=all&q=%23${m.match[2].toLowerCase()}" class="m-legible">#${
          m.match[2]
        }</a>`; // TODO: make these link locally
      },
    },
    cash: {
      rule: this.regexService.getRegex('cash'),
      replace: (m: TagMatch) => {
        return `${
          m.match[1]
        }<a href="/discovery/search?f=top&t=all&q=%24${m.match[2].toUpperCase()}" class="m-legible">$${
          m.match[2]
        }</a>`; // TODO: make these link locally
      },
    },
    at: {
      rule: this.regexService.getRegex('at'),
      replace: (m: TagMatch) => {
        return `${m.match[1]}<a class="tag" href="/${m.match[2]}" target="_blank">@${m.match[2]}</a>`;
      },
    },
  };

  constructor(
    private siteService: SiteService,
    private textParser: TextParserService,
    public regexService: RegexService
  ) {}

  /**
   * Pipe transform function - turns text into corresponding tags.
   * @param { string } value - string to parse for tags.
   * @returns { string } parsed string.
   */
  public transform(value: string): string {
    this.results = [];

    // Order is important. Url and Mail first, then smaller matches (hash and at).
    this.parseUrls(value);
    this.parse('hash', value);
    this.parse('cash', value);
    this.parse('at', value);
    // this.parse('mail', value); // commented out due to clashes with ActivityPub @ tags.

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

  /**
   * Push a match to results array.
   * @param { TagMatch } match - match object
   * @returns { void }
   */
  private push(match: TagMatch): void {
    // ignore match inside others
    if (
      this.results.findIndex(
        (m) => match.start >= m.start && match.end <= m.end
      ) !== -1
    ) {
      return;
    }
    this.results.push(match);
  }

  /**
   * Parse a string for a tag type.
   * @param { TagType } type - type to parse for.
   * @param { string } value - value to parse.
   * @returns { void }
   */
  private parse(type: TagType, value: string) {
    let match;
    while ((match = this.tags[type].rule.exec(value)) !== null) {
      this.push({
        type: type,
        start: match.index,
        end: match.index + match[0].length,
        match: match,
      });
    }
  }

  /**
   * Dedicated function for parsing URLs due to difference in handling.
   * @param { string } value - value to parse.
   * @returns { void }
   */
  private parseUrls(value: string): void {
    const extractedUrls = this.textParser.extractUrlsWithIndices(value);

    for (let urlObj of extractedUrls) {
      this.push({
        type: 'url',
        start: urlObj.indices[0],
        end: urlObj.indices[1],
        match: [urlObj.url],
      });
    }
  }
}

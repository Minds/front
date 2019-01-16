import { Pipe, Inject, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tags'
})

/**
 * Tags pipe
 */
export class TagsPipe implements PipeTransform {

  /**
   * Tags
   */
  tags = {
    url: {
      rule: /(\b(https?|ftp|file):\/\/[^\s\]]+)/gim,
      template: '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
    },
    mail: {
      rule: /([a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)/gim,
      template: '<a href="mailto:$1" target="_blank" rel="noopener noreferrer">$1</a>'
    },
    hash: {
      rule: /(^|\s||)#(\w+)/gim,
      template: '$1<a href="/newsfeed/tag/$2;ref=hashtag">#$2</a>'
    },
    at: {
      rule: /(^|\s|\W)@(\w*[a-zA-Z_-]+\w*)/gim,
      template: '$1<a class="tag" href="/$2" target="_blank">@$2</a>'
    }
  };

  /**
   * Replace tags
   * @param str
   * @param tagName
   */
  replaceTokens(str, tagName) {
    let tag = this.tags[tagName];
    return str.replace(tag.rule, tag.template);
  }

  transform(value: string): string {
    value = this.replaceTokens(value, 'url');
    value = this.replaceTokens(value, 'mail',);
    value = this.replaceTokens(value, 'hash');
    value = this.replaceTokens(value, 'at');
    return value;
  }
}

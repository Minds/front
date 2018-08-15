import { Pipe, Inject, Renderer } from '@angular/core';

@Pipe({
  name: 'tags'
})

export class TagsPipe {

  transform(value: string) {

    if (!value || typeof value !== 'string')
      return value;

    //<a>tag
    var url = /(\b(https?|ftp|file):\/\/[^\s\]]+)/gim;
    value = value.replace(url, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');

    //<a>tag
    var mail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gim;
    value = value.replace(mail, '<a href="mailto:$&" target="_blank" rel="noopener noreferrer">$&</a>');

    //#hashtag
    var hash = /(^|\s||)#(\w+)/gim;
    value = value.replace(hash, (str: any, p1: any, p2: any, offset: any, s: any) => {
      const nc = s.substr(offset+str.length, 1);
      if(['"', '<'].includes(nc)) return str;
      return `${p1}<a href="/search;q=%23${p2};ref=hashtag" target="_blank">#${p2}</a>`;
    });

    //@tag
    var at = /(^|\s|\W)@(\w*[a-zA-Z_-]+\w*)/gim;
    value = value.replace(at, '$1<a class="tag" href="/$2" target="_blank">@$2</a>');

    return value;
  }

}

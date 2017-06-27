import { Pipe, Inject, Renderer }  from '@angular/core';

@Pipe({
  name: 'tags'
})

export class TagsPipe {

  constructor() {
  }


  transform(value: string) {

    if(!value || typeof value !== "string")
      return value;

    //<a>tag
    var url = /(\b(https?|http|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    value = value.replace(url, '<a href="$1" target="_blank">$1</a>');

    //#hashtag
    var hash = /(^|\s)#(\w*[a-zA-Z_]+\w*)/gim;
    value = value.replace(hash, '$1<a href="/search;q=%23$2;type=activities" target="_blank">#$2</a>');

    //@tag
    var at = /(^|\s)\@(\w*[a-zA-Z_]+\w*)/gim;
    value = value.replace(at, '$1<a class="tag" href="/$2" target="_blank">@$2</a>');

    return value;
  }


}

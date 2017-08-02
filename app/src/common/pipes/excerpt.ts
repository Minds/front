import { Pipe, Renderer }  from '@angular/core';

@Pipe({
  name: 'excerpt'
})

export class ExcerptPipe {

  constructor( ) {
  }

  transform(value: string) {
    let maxLength: number = 140;

    if(!value || value.length <= maxLength)
      return value;

    return value.substring(0, maxLength) + "...";

  }

}

import { Pipe }  from '@angular/core';

@Pipe({
  name: 'listable',
  pure: false
})

export class ListablePipe {

  transform(value: any) {
    let result = [];

    if(!value || value.length === 0) {
      return result;
    }

    for (let i = 0; i < value.length; i++) {
      if (value[i].extras && value[i].extras.listed) {
        result.push(value[i]);
      }
    }

    return result;
  }

}

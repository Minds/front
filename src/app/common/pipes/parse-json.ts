import { Pipe } from '@angular/core';
import maxNum from '../../helpers/max';

/**
 * Will convert json to object, if an object is passed it will return the Object
 */
@Pipe({
  name: 'parseJson',
})
export class ParseJson {
  transform(input: string | Object): Object {
    let obj: Object;

    try {
      if (typeof input === 'string') {
        obj = JSON.parse(input);
      } else if (typeof input === 'object') {
        obj = input;
      }
    } catch (e) {
      console.error(e);
    }

    return obj;
  }
}

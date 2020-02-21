import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'tags' })
export class TagsPipeMock implements PipeTransform {
  transform(value: any): any {
    return value;
  }
  exec(value: any): any {
    return value;
  }
}

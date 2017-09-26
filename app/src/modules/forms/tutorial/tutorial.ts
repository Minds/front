import { Component, EventEmitter } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'minds-tutorial',
  outputs: ['done'],
  templateUrl: 'tutorial.html'
})

export class Tutorial {

  error: string = '';
  inProgress: boolean = false;
  referrer: string;

  gender: string = 'private';
  banner: string;

  done: EventEmitter<any> = new EventEmitter();

}

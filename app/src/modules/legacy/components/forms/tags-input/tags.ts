import { Component, EventEmitter, ElementRef } from '@angular/core';

import { Client, Upload } from '../../../../../services/api';
import { Session } from '../../../../../services/session';

@Component({
  selector: 'minds-form-tags-input',
  host: {
    '(click)': 'focus()'
  },
  inputs: ['_tags: tags'],
  outputs: ['change: tagsChange'],
  template: `
    <div class="m-form-tags-input-tags-tag mdl-shadow--2dp mdl-color--blue-grey-600 mdl-color-text--blue-grey-50"
      *ngFor="let tag of tags; let i = index"
      (click)="removeTag(i)">
      <span>{{tag}}</span>
      <i class="material-icons mdl-color-text--white">close</i>
    </div>
    <input
      type="text"
      name="input-tags"
      [(ngModel)]="input"
      (keyup)="keyUp($event)"
      (blur)="blur($event)"
      [size]="input.length ? input.length : 1">
  `
})

export class TagsInput {

  error: string = '';
  inProgress: boolean = false;

  input: string = '';
  placeholder: string = '+';
  tags: Array<string> = [];
  change: EventEmitter<any> = new EventEmitter();

  constructor(public session: Session, private element: ElementRef) {

  }

  set _tags(tags: Array<string>) {
    if (Array.isArray(tags))
      this.tags = tags;
  }

  keyUp(e) {

    switch (e.keyCode) {
      case 32: //space
      case 9: //tab
      case 13: //enter
      case 188: //comma
        this.push();
        break;
      case 8: //backspace
        //remove the last tag if we don't have an input
        if (!this.input) {
          this.pop();
        }
        break;
    }

    this.change.next(this.tags);
  }

  blur(e) {
    this.push();
  }

  removeTag(index: number) {
    this.tags.splice(index, 1);
    this.change.next(this.tags);
  }

  focus() {
    this.element.nativeElement.getElementsByTagName('input')[0].focus();
  }

  push() {
    let input = this.input;

    // sanitize tag
    input = input
      .replace(/^[,\s]+/, '') // strip initial commas and spaces
      .replace(/[,\s]+$/, ''); // strip final commas and spaces

    if (!input) {
      return;
    }

    this.tags.push(input);
    this.input = '';
  }

  pop() {
    this.tags.pop();
  }

}

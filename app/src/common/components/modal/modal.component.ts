import { Component, EventEmitter } from '@angular/core';

@Component({
  selector: 'm-modal',
  host: {
    '[hidden]': 'hidden'
  },
  inputs: ['open'],
  outputs: ['closed'],
  template: `
    <div class="m-modal-bg" (click)="close()"></div>
    <div class="m-modal-container">
      <div class="mdl-card mdl-shadow--2dp">
        <ng-content></ng-content>
        <div class="mdl-card__menu" (click)="close()"><i class="material-icons mdl-color-text--blue-grey-300">close</i></div>
      </div>
    </div>
  `
})

export class Modal {

  hidden: boolean = true;
  closed: EventEmitter<any> = new EventEmitter();

  set _hidden(value: boolean) {
    this.hidden = value;
  }

  set open(value: boolean) {
    this.hidden = !value;
  }

  close() {
    this.hidden = true;
    this.closed.next(true);
  }

}

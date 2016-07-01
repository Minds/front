import { Component, EventEmitter } from '@angular/core';
import { CORE_DIRECTIVES } from '@angular/common';

import { Modal } from '../modal';
import { Translate } from '../../translate/translate';

@Component({
  selector: 'm-modal-translate',
  inputs: [ 'open' ],
  outputs: [ 'closed', 'action' ],
  directives: [ CORE_DIRECTIVES, Translate, Modal ],
  template: `
    <m-modal [open]="open" (closed)="close($event)">
      <m-translate (action)="select($event.selected)"></m-translate>
    </m-modal>
  `
})

export class TranslateModal {
  open : boolean = false;
  closed : EventEmitter<any> = new EventEmitter();
  action: EventEmitter<any> = new EventEmitter();

  select(language: string) {
    if (!language) {
      this.close();
      return;
    }

    this.action.emit({
      selected: language
    });
    this.close();
  }

  close(){
    this.open = false;
    this.closed.next(true);
  }
}

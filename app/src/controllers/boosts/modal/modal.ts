import { Component, EventEmitter } from '@angular/core';

import { SessionFactory } from '../../../services/session';


@Component({
  selector: 'm-modal-boost',
  inputs: [ 'open', 'object' ],
  outputs: ['closed'],
  template: `
    <m-modal [open]="open" (closed)="done($event)">
      <minds-boost-full-network [object]="object" (done)="done()"></minds-boost-full-network>
    </m-modal>
  `
})

export class BoostModal {

  open : boolean = false;
  closed : EventEmitter<any> = new EventEmitter();
  object;

  session = SessionFactory.build();

  done(e?){
    this.closed.next(true);
  }

}

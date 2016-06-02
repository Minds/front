import { Component, EventEmitter } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { ROUTER_DIRECTIVES, Router } from 'angular2/router';

import { Modal } from '../modal';

@Component({
  selector: 'm-modal-confirm',
  inputs: ['open', 'yesButton', 'noButton'],
  outputs: ['actioned', 'closed'],
  directives: [ CORE_DIRECTIVES, ROUTER_DIRECTIVES, Modal ],
  templateUrl: 'src/components/modal/confirm/confirm.html'
})
export class ConfirmModal {

  open : boolean = false;
  closed : EventEmitter<any> = new EventEmitter();
  actioned: EventEmitter<any> = new EventEmitter();
  inProgressEmitter: EventEmitter<boolean> = new EventEmitter();
  completedEmitter: EventEmitter<number> = new EventEmitter();

  inProgress: boolean = false;
  errorlevel: number = null;

  yesButton: string = 'Yes';
  noButton: string = 'No';
  dismissButton: string = 'Dismiss';

  constructor() {
    this.inProgressEmitter.subscribe((value: boolean) => {
      this.inProgress = value;
    });
    
    this.completedEmitter.subscribe((value: number) => {
      this.errorlevel = value;
    });
  }

  close($event){
    this.open = false;
    
    this.closed.emit({
      $event: $event
    });
  }

  action($event) {
    this.actioned.emit({
      $event: $event,
      inProgress: this.inProgressEmitter,
      completed: this.completedEmitter
    });
  }
}

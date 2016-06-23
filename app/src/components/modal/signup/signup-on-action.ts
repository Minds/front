import { Component, EventEmitter } from '@angular/core';
import { CORE_DIRECTIVES } from '@angular/common';
import { ROUTER_DIRECTIVES, Router } from '@angular/router-deprecated';

import { Modal, SignupModal } from '../modal';
import { SessionFactory } from '../../../services/session';


@Component({
  selector: 'm-modal-signup-on-action',
  directives: [ CORE_DIRECTIVES, ROUTER_DIRECTIVES, Modal, SignupModal ],
  inputs: ['open','action'],
  outputs: ['closed'],
  template: `
    <m-modal-signup open="true" subtitle="You need to have a channel in order to {{action}}" *ngIf="open"></m-modal-signup>
  `
})

export class SignupOnActionModal {

  open : boolean = false;
  action : string = "";
  session = SessionFactory.build();
  closed : EventEmitter<any> = new EventEmitter();
  minds = window.Minds;

  constructor(){

  }

  close(){
    this.open = false;
    this.closed.next(true);
  }

}

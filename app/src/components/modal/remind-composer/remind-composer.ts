import { forwardRef, Component, EventEmitter } from '@angular/core';
import { CORE_DIRECTIVES } from '@angular/common';
import { ROUTER_DIRECTIVES, Router } from '@angular/router-deprecated';

import { Modal } from '../modal';
import { AutoGrow } from '../../../directives/autogrow';
import { ActivityPreview } from '../../../controllers/cards/activity/preview';

@Component({
  selector: 'm-modal-remind-composer',
  inputs: [ '_default: default', 'open', '_object: object' ],
  outputs: [ 'closed', 'post' ],
  directives: [ CORE_DIRECTIVES, ROUTER_DIRECTIVES, Modal, AutoGrow, forwardRef(() => ActivityPreview) ],
  template: `
    <m-modal [open]="open" (closed)="close($event)" class="mdl-color-text--blue-grey-700">

      <div class="m-modal-remind-composer">
        <h3 class="m-modal-remind-title">Remind</h3>

        <textarea [(ngModel)]="message"
          placeholder="Enter your remind status here (optional)"
          [autoGrow]
          ></textarea>

        <div class="m-modal-remind-composer-buttons">
          <a class="m-modal-remind-composer-send" (click)="send()">
            <i class="material-icons">send</i>
          </a>
        </div>
      </div>

      <minds-activity-preview class="mdl-shadow--8dp"
        *ngIf="object && !object.remind_object"
        [object]="object"
        ></minds-activity-preview>
        <minds-activity-preview class="mdl-shadow--8dp"
        *ngIf="object && object.remind_object"
        [object]="object.remind_object"
        ></minds-activity-preview>

    </m-modal>
  `
})

export class RemindComposerModal {

  open : boolean = false;
  closed : EventEmitter<any> = new EventEmitter();
  post : EventEmitter<any> = new EventEmitter();
  object : any = {};

  message: string = '';

  constructor() {
  }

  set _object(object: any){
    this.object = object;
  }

  set _default(message: string){
    this.message = message;
  }

  close(){
    this.open = false;
    this.closed.next(true);
  }

  send(){
    this.post.next({
      message: this.message
    });

    this.close();
  }

}

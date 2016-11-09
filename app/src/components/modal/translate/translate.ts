import { Component, EventEmitter } from '@angular/core';

@Component({
  selector: 'm-modal-translate',
  inputs: [ 'open' ],
  outputs: [ 'closed', 'action' ],
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

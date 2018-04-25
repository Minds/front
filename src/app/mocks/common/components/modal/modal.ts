import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'm-modal',
  template: ''
})
export class ModalMock {
  @Input() open: boolean;

  @Output('closed') closed: EventEmitter<any> = new EventEmitter<any>();
}

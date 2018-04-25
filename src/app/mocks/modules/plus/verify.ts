import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'm-plus--verify',
  template: ''
})
export class PlusVerify {
  @Output('closed') closed: EventEmitter<any> = new EventEmitter<any>();
}

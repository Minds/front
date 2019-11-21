import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'm-modal-confirm',
  template: ``,
})
export class ConfirmModalMock {
  @Input() open;
  @Input() action;
  @Output() closed: EventEmitter<any> = new EventEmitter<any>();
  @Input() overrideOnboarding;
}

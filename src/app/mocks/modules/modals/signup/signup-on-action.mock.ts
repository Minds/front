import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'm-modal-signup-on-action',
  template: ``
})
export class SignupOnActionModalMock {
  @Input() open;
  @Input() action;
  @Output() closed: EventEmitter<any> = new EventEmitter<any>();
  @Input() overrideOnboarding;
}

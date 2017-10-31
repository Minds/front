import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'm-material--bound-switch',
  template: ''
})
export class MaterialBoundSwitchComponentMock {
  @Input() toggled: boolean;
  @Input() disabled: boolean;

  @Output('change') changeEmitter: EventEmitter<any> = new EventEmitter<any>();
}

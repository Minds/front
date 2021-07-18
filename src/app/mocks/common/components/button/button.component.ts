import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'm-button',
})
export class ButtonComponentMock {
  @Input() saving: boolean;
  @Input() disabled: boolean;
  @Input() overlay: boolean;
  @Input() iconOnly: boolean;
  @Input() color;
  @Input() size;
  @Input() pulsating: boolean;
  @Input() showDropdownMenu: boolean;
  @Input() dropdownAnchorPosition;
  @Output() onAction: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();
}

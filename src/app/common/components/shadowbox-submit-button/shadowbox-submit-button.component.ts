import { Component, Input } from '@angular/core';

@Component({
  selector: 'm-shadowboxSubmitButton',
  templateUrl: './shadowbox-submit-button.component.html',
})
export class ShadowboxSubmitButtonComponent {
  @Input() saving: boolean = false;
  @Input() disabled: boolean = false;

  constructor() {}
}

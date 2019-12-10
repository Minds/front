import { Component, Input } from '@angular/core';

@Component({
  selector: 'm-shadowboxSubmitButton',
  templateUrl: './shadowbox-submit-button.component.html',
})
export class ShadowboxSubmitButtonComponent {
  @Input() saveStatus: string = 'unsaved';
  @Input() disabled: boolean = false;

  constructor() {}
}

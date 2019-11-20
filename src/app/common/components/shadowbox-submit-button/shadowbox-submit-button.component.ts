import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'm-shadowboxSubmitButton',
  templateUrl: './shadowbox-submit-button.component.html',
})
export class ShadowboxSubmitButtonComponent implements OnInit {
  @Input() saveStatus: string = 'unsaved';
  @Input() disabled: boolean = false;
  constructor() {}

  ngOnInit() {}
}

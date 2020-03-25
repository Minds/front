import { Component, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'm-shadowboxLayout',
  templateUrl: './shadowbox-layout.component.html',
})
export class ShadowboxLayoutComponent {
  @Input() scrollableHeader: boolean = true;
  @Input() hasHeader: boolean = true;
  @HostBinding('class.isForm') @Input() isForm: boolean = false;

  constructor() {}
}

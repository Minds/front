import { Component, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'm-dataTabsLayout',
  templateUrl: './data-tabs-layout.component.html',
})
export class DataTabsLayoutComponent {
  @Input() scrollableHeader: boolean = true;
  @Input() hasHeader: boolean = true;
  @HostBinding('class.isForm') @Input() isForm: boolean = false;

  constructor() {}
}

import { Component, OnInit, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'm-shadowboxLayout',
  templateUrl: './shadowbox-layout.component.html',
})
export class ShadowboxLayoutComponent implements OnInit {
  @Input() scrollableHeader: boolean = true;
  @Input() hasHeader: boolean = true;
  @Input() headerTitle: string;
  @Input() headerSubtitle: string;
  @Input() isForm: boolean = false;

  @HostBinding('class') get checkIsForm() {
    if (!this.isForm) {
      return '';
    }
    return 'isForm';
  }
  constructor() {}

  ngOnInit() {}
}

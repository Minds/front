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
  @HostBinding('class.isForm') @Input() isForm: boolean = false;

  constructor() {}

  ngOnInit() {}
}

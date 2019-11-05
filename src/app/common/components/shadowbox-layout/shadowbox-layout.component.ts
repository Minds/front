import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'm-shadowboxLayout',
  templateUrl: './shadowbox-layout.component.html',
})
export class ShadowboxLayoutComponent implements OnInit {
  @Input() scrollableHeader: boolean = true;
  @Input() hasHeader: boolean = true;
  constructor() {}

  ngOnInit() {}
}

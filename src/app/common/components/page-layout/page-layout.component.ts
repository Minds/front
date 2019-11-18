import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'm-pageLayout',
  templateUrl: './page-layout.component.html',
})
export class PageLayoutComponent implements OnInit {
  @Input() navId: string;
  constructor() {}

  ngOnInit() {}
}

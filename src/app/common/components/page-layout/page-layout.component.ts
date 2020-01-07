import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { Menu } from '../sidebar-menu/sidebar-menu.component';

@Component({
  selector: 'm-pageLayout',
  templateUrl: './page-layout.component.html',
})
export class PageLayoutComponent implements OnInit {
  @Input() menu: Menu;
  @HostBinding('class.isForm') @Input() isForm: boolean = false;
  constructor() {}

  ngOnInit() {}
}

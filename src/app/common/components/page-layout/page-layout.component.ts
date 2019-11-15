import { Component, OnInit, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'm-pageLayout',
  templateUrl: './page-layout.component.html',
})
export class PageLayoutComponent implements OnInit {
  @Input() menuId: string; // TODO remove this and use menuObj in analytics
  @Input() menuObj: any;
  @HostBinding('class.isForm') @Input() isForm: boolean = false;
  constructor() {}

  ngOnInit() {}
}

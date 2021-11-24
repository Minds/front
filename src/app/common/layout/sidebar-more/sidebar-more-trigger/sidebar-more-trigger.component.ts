import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'm-sidebarMore__trigger',
  templateUrl: './sidebar-more-trigger.component.html',
  styleUrls: ['./sidebar-more-trigger.component.ng.scss'],
})
export class SidebarMoreTriggerComponent implements OnInit {
  popperModifiers: any = {
    name: 'offset',
    options: {
      offset: [0, 0],
    },
  };

  shown: boolean = false;

  constructor() {}

  ngOnInit(): void {
    console.log('ojm triggeroninit');
  }
}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'm-shadowboxHeader__tabs',
  templateUrl: './shadowbox-header-tabs.component.html',
})
export class ShadowboxHeaderTabsComponent implements OnInit {
  @Input() tabs;
  @Output() tabChanged: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  changeTabs(tab) {
    this.tabChanged.emit({ tabId: tab.id });
  }
}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TopTab } from '../../../interfaces/dashboard';

@Component({
  selector: 'm-topTabs',
  templateUrl: './top-tabs.component.html',
})
export class TopTabsComponent implements OnInit {
  @Input() tabs: TopTab[];
  @Input() activeTabId: string;

  @Output() tabChanged: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  changeTab(tabId) {
    this.activeTabId = tabId;
    this.tabChanged.emit({ tabId: tabId });
  }
}

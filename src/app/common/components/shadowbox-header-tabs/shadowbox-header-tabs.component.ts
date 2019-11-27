import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ShadowboxHeaderTab } from '../../../interfaces/dashboard';

@Component({
  selector: 'm-shadowboxHeader__tabs',
  templateUrl: './shadowbox-header-tabs.component.html',
})
export class ShadowboxHeaderTabsComponent {
  @Input() tabs: ShadowboxHeaderTab[];
  @Input() activeTabId = '';
  @Output() tabChanged: EventEmitter<any> = new EventEmitter();

  constructor() {}

  changeTabs(tab) {
    this.tabChanged.emit({ tabId: tab.id });
  }
}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

export interface NestedMenuItem {
  label: string;
  id: string;
  // active?: boolean;
}

export interface NestedMenu {
  header: NestedMenuItem;
  items: NestedMenuItem[];
}

@Component({
  selector: 'm-nestedMenu',
  templateUrl: './nested-menu.component.html',
})
export class NestedMenuComponent implements OnInit {
  @Input() isNested: boolean = false;
  @Input() menus: NestedMenu[];
  @Output() itemSelected: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  itemClicked(menuHeaderId, itemId) {
    const item = { menuHeaderId: menuHeaderId, itemId: itemId };
    this.itemSelected.emit({ item: item });
  }
}

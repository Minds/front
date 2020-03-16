import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

export interface NestedMenuItem {
  label: string;
  id: string;
  route?: string;
}

export interface NestedMenu {
  header: NestedMenuItem;
  items: NestedMenuItem[];
}

/**
 * Menu list that can be used in multiple "nested" horizontal panes.
 * Each item in the list routes to the relative url of the item.id
 * (unless it has an item.route)
 */
@Component({
  selector: 'm-nestedMenu',
  templateUrl: './nested-menu.component.html',
})
export class NestedMenuComponent implements OnInit {
  @Input() isNested: boolean = false; // Determines whether to display the back button
  @Input() menus: NestedMenu[];
  @Output() itemSelected: EventEmitter<any> = new EventEmitter();
  @Output() clickedBack: EventEmitter<any> = new EventEmitter();

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {}

  itemClicked(menuHeaderId, itemId): void {
    const item = { menuHeaderId: menuHeaderId, itemId: itemId };
    this.itemSelected.emit({ item: item });
  }

  goBack(): void {
    this.clickedBack.emit();
  }
}

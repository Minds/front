import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

export interface NestedMenuItem {
  label: string;
  id: string;
  route?: string;
  pathSegments?: number;
  shouldShow?: () => boolean;
}

export interface NestedMenu {
  header: NestedMenuItem;
  items: NestedMenuItem[];
  shouldShow?: () => boolean;
}

/**
 * Menu list that can be used in multiple "nested" horizontal panes.
 * Each item in the list routes to the relative url of the item.id
 * (unless it has an item.route)
 */
@Component({
  selector: 'm-nestedMenu',
  templateUrl: './nested-menu.component.html',
  styleUrls: ['./nested-menu.component.ng.scss'],
})
export class NestedMenuComponent implements OnInit {
  @Input() isNested: boolean = false; // Determines whether to display the back button
  @Input() menus: NestedMenu[];
  @Input() parentRoute: string;
  @Input() disableActiveClass: boolean = false;
  @Output() itemSelected: EventEmitter<any> = new EventEmitter();
  @Output() clickedBack: EventEmitter<any> = new EventEmitter();

  ngOnInit(): void {
    this.filterMenus();
  }

  /**
   * Remove items where shouldShow is explicitly false
   */
  private filterMenus() {
    this.menus = this.menus.filter(menu => {
      return !menu.shouldShow || menu.shouldShow();
    });

    for (let menu of this.menus) {
      menu.items = menu.items.filter(item => {
        return !item.shouldShow || item.shouldShow();
      });
    }
  }

  itemClicked(menuHeaderId, itemId): void {
    const item = { menuHeaderId: menuHeaderId, itemId: itemId };
    this.itemSelected.emit({ item: item });
  }

  /**
   * By default, the router link is relative.
   * If the parentRoute input is present, the
   * relative route is overriden with an absolute one.
   * @param itemId
   */
  getRouterLink(itemId: string): string {
    if (!this.parentRoute) {
      return this.isNested ? itemId : `../${itemId}`;
    }

    return `${this.parentRoute}/${itemId}`;
  }

  goBack(): void {
    this.clickedBack.emit();
  }
}

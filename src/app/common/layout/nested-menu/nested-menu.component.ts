import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

export interface NestedMenuItem {
  label: string;
  id: string;
}

export interface NestedMenu {
  header: NestedMenuItem;
  items: NestedMenuItem[];
}

/**
 * Menu list that can be used in multiple "nested" horizontal panes.
 * Each item in the list routes to the relative url of the item.id
 */
@Component({
  selector: 'm-nestedMenu',
  templateUrl: './nested-menu.component.html',
})
export class NestedMenuComponent implements OnInit {
  @Input() isNested: boolean = false; // Determines whether to display the back button
  @Input() menus: NestedMenu[];
  // @Input() routerLinkPrefix: string = '/';
  // @Input() useMenuIdInRouterLink: boolean = true;
  @Output() itemSelected: EventEmitter<any> = new EventEmitter();

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {}

  itemClicked(menuHeaderId, itemId) {
    const item = { menuHeaderId: menuHeaderId, itemId: itemId };
    this.itemSelected.emit({ item: item });
  }

  goBack(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  // getRouterLink(menuHeaderId, itemId) {
  //   const routerLinkMiddle = this.useMenuIdInRouterLink ? menuHeaderId : '';
  //   const routerLinkSuffix = `/${routerLinkMiddle}/${itemId}`;
  //   return this.routerLinkPrefix + routerLinkSuffix;
  // }
}

import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { TreeNode } from '../../tree/tree-node.model';

type Category = { id: string, label: string };

@Component({
  moduleId: module.id,
  selector: 'm-categories--selector',
  templateUrl: 'selector.component.html'
})

export class CategoriesSelectorComponent {

  selected: Array<any> = [];
  categories: Array<Category> = [];
  menuOpened: boolean = false;
  q: string = '';
  @ViewChild('input', { read: ElementRef }) input: ElementRef;
  @ViewChild('list', { read: ElementRef }) list: ElementRef;

  @Output('selected') onSelected: EventEmitter<Array<Category>> = new EventEmitter<Array<Category>>();

  constructor() {
    this.categories = window.Minds.categories;
  }

  search(value: string) {
    this.q = value;
    this.openMenu();
  }

  select(item: TreeNode) {
    const index: number = this.selected.findIndex((selected) => {
      return selected === item.original
    });
    if (index === -1) {
      this.selected.push(item.original);
    }

    this.onSelected.emit(this.selected);

    this.closeMenu();
  }

  openMenu() {
    this.menuOpened = true;
    const inputRect: ClientRect = this.input.nativeElement.getBoundingClientRect();
    const listRect: ClientRect = this.list.nativeElement.getBoundingClientRect();
    this.list.nativeElement.style.minWidth = inputRect.width + 'px';

    this.list.nativeElement.style.height = Math.max(window.innerHeight - listRect.top - 100, 100) + 'px';
  }


  @HostListener('blur')
  closeMenu() {
    this.menuOpened = false;
  }
}
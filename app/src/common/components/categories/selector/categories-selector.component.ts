import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { TreeNode } from '../../tree/tree-node.model';

type Category = { id: string, label: string };

@Component({
  moduleId: module.id,
  selector: 'm--categories-selector',
  templateUrl: 'categories-selector.component.html'
})

export class CategoriesSelectorComponent {
  selectedCategories: Array<any> = [];
  categories: Array<Category> = [];
  menuOpened: boolean = false;
  q: string = '';
  @ViewChild('input', { read: ElementRef }) input: ElementRef;
  @ViewChild('list', { read: ElementRef }) list: ElementRef;

  @Output() selectedCategoriesChange: EventEmitter<Array<Category>> = new EventEmitter<Array<Category>>();

  constructor() {
    this.categories = window.Minds.categories;
  }

  suggestCategories(value: string) {
    this.q = value;
    this.openMenu();
  }

  selectCategory(item: TreeNode) {
    const index: number = this.selectedCategories.findIndex((selected) => {
      return selected === item.original
    });
    if (index === -1) {
      this.selectedCategories.push(item.original);
    }
    this.selectedCategoriesChange.emit(this.selectedCategories);

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
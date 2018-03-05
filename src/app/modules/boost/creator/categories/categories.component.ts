import { Component, Input, Output, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

type CurrencyType = 'points' | 'usd' | 'tokens';

@Component({
  providers: [ CurrencyPipe ],
  selector: 'm-boost--creator-categories',
  templateUrl: 'categories.component.html'
})
export class BoostCreatorCategoriesComponent {

  @Input() boost;
  @Output() boostChanged: EventEmitter<any> = new EventEmitter();
  categories = [];
  maxCategories: number = 3;

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
  ) { }

  onSelected(categories) {
    if (categories.length >= this.maxCategories) {
      return;
    }

    this.categories = categories;
    this.boost.categories = categories.map((value) => {
      return value.id;
    });
  }

}

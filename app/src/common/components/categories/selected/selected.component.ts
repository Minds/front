import { Component, forwardRef, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export const SELECTED_CATEGORIES_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CategoriesSelectedComponent),
  multi: true
};

type Category = { id: string, label: string, children?: string };

@Component({
  selector: 'm-categories--selected',
  template: `
    <div class="m-categories-selected--categories">
      <div class="m-categories--selected--category" *ngFor="let category of categories">
        {{category.label}}
        <i class="material-icons" (click)="deselect(category)">close</i>
      </div>

    </div>
  `,
  providers: [SELECTED_CATEGORIES_VALUE_ACCESSOR]
})

export class CategoriesSelectedComponent implements ControlValueAccessor, OnChanges {

  categories: Array<Category>;

  deselect(category: Category) {
    const index: number = this.categories.findIndex((value) => {
      return value.id === category.id
    });
    this.categories.splice(index, 1);
    this.categories = this.categories.slice();
  }

  propagateChange = (_: any) => {
  };

  ngOnChanges(changes: any) {
    this.propagateChange(changes);
  }

  writeValue(value: Category[]) {
    this.categories = value;
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any) {
  }
}

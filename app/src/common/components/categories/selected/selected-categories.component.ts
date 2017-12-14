import { Component, forwardRef, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export const SELECTED_CATEGORIES_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SelectedCategoriesComponent),
  multi: true
};

type Category = { id: string, label: string, children?: string };

@Component({
  moduleId: module.id,
  selector: 'm--selected-categories',
  template: `
    <div class="m-categories-selector--selected-categories">
      <div class="m-categories-selector--selected-category" *ngFor="let category of selectedCategories">
        {{category.label}}
        <i class="material-icons" (click)="unselectCategory(category)">close</i>
      </div>

    </div>
  `,
  host: {
    'change': 'propagateChange($event.target.value)'
  },
  providers: [SELECTED_CATEGORIES_VALUE_ACCESSOR]
})

export class SelectedCategoriesComponent implements ControlValueAccessor, OnChanges {

  selectedCategories: Array<Category>;

  unselectCategory(category: Category) {
    const index: number = this.selectedCategories.findIndex((value) => {
      return value.id === category.id
    });
    this.selectedCategories.splice(index, 1);
    this.selectedCategories = this.selectedCategories.slice();
  }

  propagateChange = (_: any) => {
  };

  ngOnChanges(changes: any) {
    this.propagateChange(changes);
  }

  writeValue(value: Category[]) {
    this.selectedCategories = value;
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any) {
  }
}

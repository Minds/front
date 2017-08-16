import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  moduleId: module.id,
  selector: 'm-date-selector',
  template: `
    <label class="m-date-selector--label" *ngIf="label">{{label}}</label>
    <div class="m-date-selector--input" [mdl-datetime-picker] [date]="date" (dateChange)="onDateChange($event)">
      <input type="text" placeholder="select a date" [ngModel]="date | date:'short'"
        (ngModelChange)="onDateChange($event)">
      <i class="material-icons">keyboard_arrow_down</i>
    </div>
  `,
  providers: [ DatePipe ]
})

export class DateSelectorComponent {
  @Input() label: string;
  @Input() date: string;
  @Output() dateChange: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

  onDateChange(newDate) {
    this.dateChange.emit(newDate);
  }
}

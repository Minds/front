import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'minds-date-input',
  template: `
    <div class="m-date-input--field">
      <select [ngModel]="selectedMonth" (ngModelChange)="selectedMonth = $event; build()" [disabled]="disabled">
        <option value=""><i i18n="@@COMMON__DATE_INPUT__MONTH_LABEL">Month</i></option>
        <option *ngFor="let month of months; let i = index"
          [value]="i + 1"
        >{{ month }}</option>
      </select>
    </div>
    <div class="m-date-input--field">
      <select [ngModel]="selectedDay" (ngModelChange)="selectedDay = $event; build()" [disabled]="disabled">
        <option value=""><i i18n="@@COMMON__DATE_INPUT__DAY_LABEL">Day</i></option>
        <option *ngFor="let day of days"
          [value]="day"
          [disabled]="!isDayAvailable(day, selectedMonth)"
        >{{ day }}</option>
      </select>
    </div>
    <div class="m-date-input--field">
      <select [ngModel]="selectedYear" (ngModelChange)="selectedYear = $event; build()" [disabled]="disabled">
        <option value=""><i i18n="@@COMMON__DATE_INPUT__YEAR_LABEL">Year</i></option>
        <option *ngFor="let year of years"
          [value]="year"
        >{{ year }}</option>
      </select>
    </div>
  `
})

export class DateInputComponent implements OnInit {

  months: string[];
  days: string[];
  years: string[];

  selectedMonth: string = '';
  selectedDay: string = '';
  selectedYear: string = '';
  @Input() showClearButton: boolean = true;
  @Input() disabled: boolean = false;

  @Output() dateChange: EventEmitter<any> = new EventEmitter();
  @Input() set date(value: string) {

    if (!value)
      return;

    if (value === this._date) {
      return;
    }

    let values = value.split('-');

    if (values.length < 1 || values.length > 3) {
      return;
    }

    if (values.length === 3) {
      this.selectedYear = values.shift();
    }

    if (values[0].length === 4) {
      // Old style YYYY-MM (no day)
      this.selectedYear = values[0];
      this.selectedMonth = `${parseInt(values[1], 10)}`;
    } else {
      this.selectedMonth = `${parseInt(values[0], 10)}`;

      if (values.length === 2) {
        this.selectedDay = this.pad(values[1], 2);
      }
    }

    this._date = value;
  }

  private _date: string;

  ngOnInit() {
    this.months = [
      'January', 'February', 'March',
      'April', 'May', 'June',
      'July', 'August', 'September',
      'October', 'November', 'December'
    ];

    this.days = [];
    for (let day = 1; day <= 31; day++) {
      this.days.push(this.pad(day, 2));
    }

    this.years = [];
    let initialYear = (new Date()).getFullYear() - 13;
    for (let year = initialYear; year >= initialYear - 100; year--) {
      this.years.push(this.pad(year, 4));
    }
  }

  build() {
    let date: string = '';

    if (this.selectedMonth !== '') {
      if (this.selectedYear) {
        date = `${this.pad(this.selectedYear, 4)}-`;
      }

      date += `${this.pad(this.selectedMonth, 2)}`;

      if (this.selectedDay) {
        date += `-${this.pad(this.selectedDay, 2)}`;
      }
    }

    this._date = date;
    this.dateChange.emit(date);
  }

  clear() {
    this.selectedMonth = '';
    this.selectedDay = '';
    this.selectedYear = '';

    this.build();
  }

  isDayAvailable(day: any, month: any) {
    if (!month) {
      return true;
    }

    if (typeof day !== 'number') {
      day = parseInt(day, 10);
    }

    if (typeof month !== 'number') {
      month = parseInt(month, 10);
    }

    switch (month) {
      case 2:
        if (day > 29) {
          return false;
        }
      case 4:
      case 6:
      case 9:
      case 11:
        if (day > 30) {
          return false;
        }
    }

    return true;
  }

  private pad(val: any, pad: number = 0) {
    if (!pad) {
      return val;
    }

    return (Array(pad + 1).join('0') + val).slice(-pad);
  }
}

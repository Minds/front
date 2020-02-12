import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'm-date__dropdowns',
  template: `
    <div class="m-dateDropdowns__selectWrapper">
      <select
        data-minds="monthDropdown"
        [ngModel]="selectedMonth"
        (ngModelChange)="selectMonth($event)"
      >
        <option *ngFor="let month of monthNames">{{ month }}</option>
      </select>
    </div>
    <div class="m-dateDropdowns__selectWrapper">
      <select
        data-minds="dayDropdown"
        [ngModel]="selectedDay"
        (ngModelChange)="selectDay($event)"
      >
        <option *ngFor="let day of days">{{ day }}</option>
      </select>
    </div>
    <div class="m-dateDropdowns__selectWrapper">
      <select
        data-minds="yearDropdown"
        [ngModel]="selectedYear"
        (ngModelChange)="selectYear($event)"
      >
        <option *ngFor="let year of years">{{ year }}</option>
      </select>
    </div>
  `,
})
export class DateDropdownsComponent implements OnInit {
  @Output() selectedDateChange: EventEmitter<string> = new EventEmitter<
    string
  >();
  monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  days = [1];
  years = [];

  selectedMonth = 'January';
  selectedDay = '1';
  selectedYear = new Date().getFullYear();

  constructor() {}

  ngOnInit() {
    this.years = this.range(100, this.selectedYear, false);
    this.selectedYear = this.years[0];
    this.selectMonth('January', false);
  }

  selectMonth(month: string, emit: boolean = true) {
    this.selectedMonth = month;

    this.populateDays(
      this.getDaysInMonth(this.getMonthNumber(month), this.selectedYear)
    );

    if (emit) {
      this.emitChanges();
    }
  }

  selectDay(day: string, emit: boolean = true) {
    this.selectedDay = day;

    if (emit) {
      this.emitChanges();
    }
  }

  selectYear(year, emit: boolean = true) {
    this.selectedYear = year;

    this.populateDays(
      this.getDaysInMonth(this.getMonthNumber(this.selectedMonth), year)
    );

    if (emit) {
      this.emitChanges();
    }
  }

  emitChanges() {
    this.selectedDateChange.emit(this.buildDate());
  }

  buildDate() {
    let date: string = '';

    if (this.selectedMonth !== '') {
      if (this.selectedYear) {
        date = `${this.pad(this.selectedYear, 4)}-`;
      }

      const monthIndex = this.monthNames.findIndex(
        item => item === this.selectedMonth
      );

      date += `${this.pad(monthIndex + 1, 2)}`;

      if (this.selectedDay) {
        date += `-${this.pad(this.selectedDay, 2)}`;
      }
    }

    return date;
  }

  private populateDays(maxDays: number) {
    this.days = this.range(maxDays, 1);
  }

  private getMonthNumber(month: string): number {
    return this.monthNames.indexOf(month);
  }

  private getDaysInMonth(month, year): number {
    // let date = new Date(Date.UTC(year, month, 1));
    const date = new Date(year, month, 1);
    let day = 0;
    while (date.getMonth() === month) {
      day = date.getDate();
      date.setDate(date.getDate() + 1);
    }
    return day;
  }

  private range(size, startAt = 0, grow = true): Array<number> {
    return Array.from(Array(size).keys()).map(i => {
      if (grow) {
        return i + startAt;
      } else {
        return startAt - i;
      }
    });
  }

  private pad(val: any, pad: number = 0) {
    if (!pad) {
      return val;
    }

    return (Array(pad + 1).join('0') + val).slice(-pad);
  }
}

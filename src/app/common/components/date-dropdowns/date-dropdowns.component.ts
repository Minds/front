import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

/**
 * string Month names or empty string.
 */
export type MonthName =
  | 'January'
  | 'February'
  | 'March'
  | 'April'
  | 'May'
  | 'June'
  | 'July'
  | 'August'
  | 'September'
  | 'October'
  | 'November'
  | 'December'
  | '';

/**
 * Allows user to input a specific date (e.g. their birthday)
 * via three dropdowns (year, month, day)
 */
@Component({
  selector: 'm-date__dropdowns',
  templateUrl: './date-dropdowns.component.html',
})
export class DateDropdownsComponent implements OnInit {
  @Input() disabled: boolean = false;

  /**
   * Set whole date and emit changes. Used to set default and "completed" states.
   * @param { string } - date in format yyyy-mm-dd
   */
  @Input() set selectedDate(date: string) {
    if (!date) {
      return;
    }
    try {
      const parts = date.split('-').map((part) => parseInt(part, 10));

      if (!parts[0] || !parts[1] || !parts[2]) {
        return;
      }

      this.selectYear(parts[0], false);
      this.selectMonth(this.getMonthByIndex(parts[1] - 1), false);
      this.selectDay(parts[2].toString(), false);
      this.emitChanges();
    } catch (e) {
      // likely a malformed date, do noting.
    }
  }

  @Output()
  selectedDateChange: EventEmitter<string> = new EventEmitter<string>();

  /**
   * Ordered array of month names.
   */
  monthNames: MonthName[] = [
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

  selectedMonth: MonthName = '';
  selectedDay: string = '';
  selectedYear: string = '';

  constructor() {}

  ngOnInit() {
    this.years = this.range(100, new Date().getFullYear(), false);
  }

  /**
   * Selects a given month to a given MonthName
   * @param { MonthName } - e.g. 'January', 'February'
   * @returns { void }
   */
  selectMonth(month: MonthName, emit: boolean = true): void {
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
    if (
      this.selectedYear === '' ||
      this.selectedMonth === '' ||
      this.selectedDay === ''
    ) {
      this.selectedDateChange.emit('');
    } else {
      this.selectedDateChange.emit(this.buildDate());
    }
  }

  /**
   * Builds date in yyyy-mm-dd format.
   * @returns { string } - string of date in yyyy-mm-dd format
   */
  buildDate(): string {
    let date: string = '';

    if (this.selectedMonth !== '') {
      if (this.selectedYear) {
        date = `${this.pad(this.selectedYear, 4)}-`;
      }

      const monthIndex = this.monthNames.findIndex(
        (item) => item === this.selectedMonth
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

  /**
   * Gets number of month by name.
   * @param month
   */
  private getMonthNumber(month: MonthName): number {
    return this.monthNames.indexOf(month);
  }

  /**
   * Gets month by index !IMPORTANT! +1 to account for
   * array causing 'January' to be offset to 0 rather than 1.
   * @param { index } - month index.index
   * @returns { MonthName } - 'January', 'February' etc.
   */
  private getMonthByIndex(index: number): MonthName {
    return this.monthNames[index];
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
    return Array.from(Array(size).keys()).map((i) => {
      if (grow) {
        return i + startAt;
      } else {
        return startAt - i;
      }
    });
  }

  /**
   * Pads a date value if necessary, so '1' for January becomes '01'.
   * @param { any } val - value to be padded.
   * @param { number } - positions to pad.
   * @returns { string } - padding number.
   */
  private pad(val: any, pad: number = 0): string {
    if (!pad) {
      return val;
    }

    return (Array(pad + 1).join('0') + val).slice(-pad);
  }
}

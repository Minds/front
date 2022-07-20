import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  getCalendar,
  normalizeDate,
  normalizeMonth,
  WeekDays,
} from '../../../helpers/date';

/**
 * Common calendar component, supports minimum and maximum date.
 * Set the current date via the 'date' input.
 */
@Component({
  selector: 'm-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'calendar.component.html',
})
export class CalendarComponent {
  /**
   * Date binding. Sets current date and displayed month
   * @param date
   * @private
   */
  @Input('date') set _date(date: Date) {
    this.date = date;
    this.currentMonth = new Date(date.getTime());
  }

  /**
   * Minimum date to display and pick
   */
  @Input() minDate: Date;

  /**
   * Maximum date to display and pick
   */
  @Input() maxDate: Date;

  /**
   * Date selection event emitter
   */
  @Output('dateChange') dateChangeEmitter: EventEmitter<
    Date
  > = new EventEmitter<Date>();

  /**
   * Date state
   */
  date: Date = new Date();

  /**
   * Currently active month
   */
  currentMonth: Date = new Date();

  /**
   * Get all weekdays
   */
  get weekdays(): Date[] {
    return Array(7)
      .fill('')
      .map((_, i) => new Date(1970, 0, 4 + i, 12));
  }

  /**
   * Get calendar 2D array
   * @todo support different starting weekday
   */
  get weeks(): Date[][] {
    return getCalendar(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth(),
      WeekDays.Sunday
    );
  }

  /**
   * Returns next/prev month
   * @param delta
   */
  currentMonthDelta(delta: number) {
    return new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() + delta
    );
  }

  /**
   * Checks if a certain month should be displayed/selectable
   * @param month
   */
  canSetCurrentMonth(month: Date): boolean {
    return (
      month &&
      (!this.minDate ||
        normalizeMonth(month) >= normalizeMonth(this.minDate)) &&
      (!this.maxDate || normalizeMonth(month) <= normalizeMonth(this.maxDate))
    );
  }

  /**
   * Sets the current displayed month
   * @param month
   */
  setCurrentMonth(month: Date): void {
    if (!this.canSetCurrentMonth(month)) {
      return;
    }

    this.currentMonth = month;
  }

  /**
   * Checks if the date is set in the current displayed month
   * @param date
   */
  inCurrentMonth(date: Date): boolean {
    return normalizeMonth(date) === normalizeMonth(this.currentMonth);
  }

  /**
   * Checks if a certain date can be selected
   * @param date
   */
  canSelect(date: Date) {
    return (
      date &&
      (!this.minDate || normalizeDate(date) >= normalizeDate(this.minDate)) &&
      (!this.maxDate || normalizeDate(date) <= normalizeDate(this.maxDate))
    );
  }

  /**
   * Returns if a certain date is selected
   * @param date
   */
  isSelected(date: Date) {
    return normalizeDate(date) === normalizeDate(this.date);
  }

  /**
   * Triggers date selection
   * @param date
   */
  onDateSelect(date: Date): void {
    if (!this.canSelect(date)) {
      return;
    }

    this.date = date;
    this.dateChangeEmitter.emit(date);
  }
}

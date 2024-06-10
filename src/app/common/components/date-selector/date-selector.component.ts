import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

/**
 * Date and time picker / selector.
 * Uses owl-date-time plugin
 *
 * See it in wallet rewards
 * @author Ben Hayward
 */
@Component({
  selector: 'm-date-selector',
  templateUrl: './date-selector.component.html',
})
export class DateSelectorComponent {
  @Output() dateChange: EventEmitter<any> = new EventEmitter<any>();

  @Input() dateFormat: string = 'short'; // legacy. TODO: implement localization.
  @Input() label: string; // label for input.

  @Input() hideInput = false; // text input showing the date.
  @Input() calendarType = 'calendar'; // timer/calendar/both.

  @Input() i18n?: string; // i18n string to accompany tooltip text.
  @Input() tooltipIcon?: string; // tooltip icon.
  @Input() tooltipText?: string; // tooltip text.

  @ViewChild('dt') dateTimePicker;

  protected _date: any;

  @Input('date') // parse input into Date object.
  set date(value: number) {
    // If ms not included in timestamp, multiply..
    if (value && value.toString().length <= 10) {
      value = value * 1000;
    }
    this._date = new Date(value ? value : Date.now());
  }

  get date() {
    return this._date;
  }

  protected _min: Date;

  @Input('min') // parse input into Date object.
  set min(value) {
    this._min = new Date(value);
  }

  get min(): any {
    return this._min;
  }

  protected _max: Date;

  @Input('max') // parse input into Date object.
  set max(value) {
    this._max = new Date(value);
  }

  get max(): any {
    return this._max;
  }

  /**
   * Called when date changes.
   * @param newDate - the new date.
   */
  public onDateChange(newDate: number): void {
    this.dateChange.emit(newDate);
  }

  public open(e: MouseEvent): void {
    this.dateTimePicker.open();
  }
}

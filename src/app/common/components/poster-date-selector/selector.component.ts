import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  moduleId: module.id,
  selector: 'm-poster-date-selector',
  templateUrl: 'selector.component.html',
  providers: [DatePipe],
})
export class PosterDateSelectorComponent {
  @Input() date: string;
  @Output() dateChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() onError: EventEmitter<String> = new EventEmitter<String>();

  @Input() dateFormat: string = 'short';

  onDateChange(newDate) {
    const validation = this.validate(newDate);
    if (validation !== true) {
      this.onError.emit(validation);
      return;
    }

    this.date = newDate;
    newDate = new Date(newDate).getTime();
    newDate = Math.floor(+newDate / 1000);
    this.dateChange.emit(newDate);
  }

  hasDateSelected() {
    return this.date && this.date !== '';
  }

  validate(newDate) {
    const date = new Date(newDate);

    const threeMonths = new Date();
    threeMonths.setMonth(threeMonths.getMonth() + 3);
    if (date >= threeMonths) {
      return "Scheduled date can't be 3 months or more";
    }

    const fiveMinutes = new Date();
    fiveMinutes.setMinutes(fiveMinutes.getMinutes() + 5);
    if (date < fiveMinutes) {
      return "Scheduled date can't be less than 5 minutes or in the past";
    }

    return true;
  }

  getDate() {
    const tempDate = parseInt(this.date);
    if (tempDate) {
      this.date = new Date(tempDate * 1000).toString();
    }
    return this.date;
  }
}

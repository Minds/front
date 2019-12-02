import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Timespan } from '../../../interfaces/dashboard';

@Component({
  selector: 'm-timespanFilter',
  templateUrl: './timespan-filter.component.html',
})
export class TimespanFilterComponent {
  @Input() timespans: Timespan[];
  @Input() activeTimespanId: string;
  @Output() timespanChanged: EventEmitter<any> = new EventEmitter();

  constructor() {}

  changeTimespan(timespanId) {
    this.timespanChanged.emit({ timespanId: timespanId });
  }
}

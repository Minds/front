import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

type timespanOption = 'hourly' | 'daily' | 'monthly';

@Component({
  selector: 'm-analytics__card',
  templateUrl: 'card.component.html',
  host: {
    class: 'm-border',
  },
})
export class AnalyticsCardComponent implements OnInit {
  @Input() title: string;
  @Input() options: Array<timespanOption>;
  @Input() defaultOption: timespanOption = 'monthly';

  @Output() selectedOptionChange: EventEmitter<
    timespanOption
  > = new EventEmitter<timespanOption>();

  selectedOption: timespanOption;

  ngOnInit() {
    if (this.defaultOption) {
      this.selectedOption = this.defaultOption;
    }
  }

  selectOption(value: timespanOption) {
    this.selectedOption = value;
    this.selectedOptionChange.emit(this.selectedOption);
  }
}

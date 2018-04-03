import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { default as DateTimePicker } from 'material-datetime-picker';

@Directive({
  selector: '[mdl-datetime-picker]',
  providers: [ DatePipe ]
})
export class MaterialDateTimePickerDirective {
  @Input() date;
  @Output() dateChange: EventEmitter<any> = new EventEmitter<any>();
  private open: boolean = false;
  private picker;

  constructor(public datePipe: DatePipe) { }

  @HostListener('click')
  onHostClick() {
    if (!this.open) {
      this.picker = new DateTimePicker()
        .on('submit', this.submitCallback.bind(this))
        .on('close', this.close.bind(this));
      this.open = true;
      this.picker.open();
    }
  }

  private submitCallback(value) {
    this.dateChange.emit(this.datePipe.transform(value.format(), 'short'));
    this.close();
  }

  private close() {
    this.picker.off('submit', this.submitCallback);
    this.picker.off('close', this.close);
    this.open = false;
  }
}

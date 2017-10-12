import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'infinite-scroll',
  template: ''
})
export class InfiniteScrollMock {
  @Input() distance;
  @Input() on;
  @Input() inProgress;
  @Input() moreData;
  @Input() hideManual;

  @Output() loadHandler: EventEmitter<any> = new EventEmitter();
}

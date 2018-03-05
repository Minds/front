/**
 * Created by Nicolas on 21/09/2017.
 */
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'infinite-scroll',
  template: ''
})
export class InfiniteScrollMock {
  @Output() load: EventEmitter<any> = new EventEmitter<any>();
  @Input() inProgress;
  @Input() moreData;
  @Input() distance;
}

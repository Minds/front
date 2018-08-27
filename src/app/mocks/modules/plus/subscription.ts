import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'm-plus--subscription',
  template: ''
})
export class PlusSubscription {
  @Input() period: boolean = false;

  setAmount = () => {}
}

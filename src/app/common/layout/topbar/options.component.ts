import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Session } from '../../../services/session';

@Component({
  selector: 'm-topbar--navigation--options',
  templateUrl: 'options.component.html',
})
export class TopbarOptionsComponent {
  @Input() options: Array<string> = ['rating'];
  @Output() change: EventEmitter<{ rating }> = new EventEmitter();

  constructor(public session: Session) {}

  get rating() {
    return this.session.getLoggedInUser().boost_rating;
  }
}

import { Component } from '@angular/core';
import { Session } from '../../../../../services/session';

@Component({
  selector: 'm-analyticsactivity__card',
  templateUrl: 'activity.component.html',
})
export class ActivityCardComponent {
  constructor(public session: Session) {}
}

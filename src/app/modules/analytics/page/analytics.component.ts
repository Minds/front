import { Component } from '@angular/core';
import { Session } from '../../../services/session';

@Component({
  selector: 'm-analytics',
  templateUrl: 'analytics.component.html',
})
export class AnalyticsComponent {
  constructor(public session: Session) {}
}

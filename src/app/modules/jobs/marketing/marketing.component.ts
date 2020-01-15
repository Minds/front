import { Component } from '@angular/core';
import { Session } from '../../../services/session';

@Component({
  selector: 'm-jobs--marketing',
  templateUrl: 'marketing.component.html',
})
export class JobsMarketingComponent {
  minds = window.Minds;
  user;

  constructor(private session: Session) {}

  ngOnInit() {
    this.user = this.session.getLoggedInUser();
  }
}

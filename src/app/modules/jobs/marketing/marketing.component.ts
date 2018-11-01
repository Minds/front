import { Component } from '@angular/core';
import { MindsTitle } from '../../../services/ux/title';
import { Session } from '../../../services/session';

@Component({
  selector: 'm-jobs--marketing',
  templateUrl: 'marketing.component.html'
})

export class JobsMarketingComponent {

  minds = window.Minds;
  user;

  constructor(
    private title: MindsTitle,
    private session: Session,
  ) {
    this.title.setTitle('Join the team');
  }

  ngOnInit() {
    this.user = this.session.getLoggedInUser();
  }

}

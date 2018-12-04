import { Component } from '@angular/core';
import { MindsTitle } from '../../../services/ux/title';
import { Session } from '../../../services/session';

@Component({
  selector: 'm-mobile--marketing',
  templateUrl: 'marketing.component.html'
})

export class MobileMarketingComponent {

  minds = window.Minds;
  user;

  constructor(
    private title: MindsTitle,
    private session: Session,
  ) {
    this.title.setTitle('Mobile');
  }

  ngOnInit() {
    this.user = this.session.getLoggedInUser();
  }

}

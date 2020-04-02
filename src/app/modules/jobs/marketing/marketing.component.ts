import { Component } from '@angular/core';
import { Session } from '../../../services/session';
import { ConfigsService } from '../../../common/services/configs.service';

@Component({
  selector: 'm-jobs--marketing',
  templateUrl: 'marketing.component.html',
})
export class JobsMarketingComponent {
  user;

  constructor(private session: Session, public configs: ConfigsService) {}

  ngOnInit() {
    this.user = this.session.getLoggedInUser();
  }
}

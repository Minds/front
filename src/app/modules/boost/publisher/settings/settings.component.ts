import { Component, Input } from '@angular/core';
import { Client } from '../../../../services/api/client';
import { Session } from '../../../../services/session';
import { BoostConsoleFilter } from '../../console/console.component';

@Component({
  selector: 'm-boost-publisher--settings',
  templateUrl: 'settings.component.html',
})
export class BoostPublisherSettingsComponent {
  _filter: BoostConsoleFilter;

  inProgress: boolean = false;

  constructor(private client: Client, public session: Session) {}

  submit(publisher: boolean) {
    this.inProgress = true;
    this.session.getLoggedInUser().show_boosts = true;
    this.client
      .post(`api/v1/settings/${this.session.getLoggedInUser().guid}`, {
        show_boosts: publisher,
      })
      .then(() => {
        this.inProgress = false;
      })
      .catch(() => {
        this.session.getLoggedInUser().show_boosts = false;
        this.inProgress = false;
      });
  }

  isMerchant() {
    const user = this.session.getLoggedInUser();
    return user && user.merchant;
  }
}

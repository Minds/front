import { Injectable } from '@angular/core';
import { Client } from '../../common/api/client.service';
import { Session } from '../../services/session';

@Injectable({
  providedIn: 'root',
})
export class SettingsV2Service {
  constructor(private client: Client, protected session: Session) {}

  async loadSettings(guid) {
    try {
      const response = <any>await this.client.get('api/v1/settings/' + guid);
      console.log('load response', response);

      return response;
    } catch (e) {
      console.error(e);
      return e;
    }
  }

  async updateSettings(guid, form) {
    // email: this.email,
    // password: this.password,
    // new_password: this.password2,
    // mature: this.mature ? 1 : 0,
    // disabled_emails: this.enabled_mails ? 0 : 1,
    // language: this.language,
    // categories: this.selectedCategories,
    // toaster_notifications: this.toaster_notifications,
    // hide_share_buttons: !this.show_share_buttons,

    try {
      const response = <any>(
        await this.client.post('api/v1/settings/' + guid, form)
      );
      console.log('update response', response);

      return response;
    } catch (e) {
      console.error(e);
      return e;
    }
  }
}

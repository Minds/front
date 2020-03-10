import { Injectable } from '@angular/core';
import { Client } from '../../common/api/client.service';
import { Session } from '../../services/session';
import { BehaviorSubject } from 'rxjs';

export interface EditableUserSettings {
  name: string;
  email: string;
  // language: string;
  // password: string;
  // new_password: string;
  // disabled_emails: boolean;
  // categories: any;
  // mature: boolean;
  // hide_share_buttons: boolean;
  // toaster_notifications: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class SettingsV2Service {
  settings: EditableUserSettings = {
    name: '',
    email: '',
  };
  settings$: BehaviorSubject<EditableUserSettings> = new BehaviorSubject(
    this.settings
  );
  constructor(private client: Client, protected session: Session) {}

  async loadSettings(guid): Promise<any> {
    try {
      const { channel } = <any>await this.client.get('api/v1/settings/' + guid);
      console.log('load response', channel);

      // TODOOJM how to get just the overlap?
      // this.settings = {...channel};

      // this.settings$.next(this.settings);

      return channel;
    } catch (e) {
      console.log('load error');
      console.error(e);
      return e;
    }
  }

  async updateSettings(guid, form): Promise<any> {
    // name: this.name
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
      // const { channel } = <any>(
      const response = <any>(
        await this.client.post('api/v1/settings/' + guid, form)
      );
      // this.settings = { ...this.settings, form };
      // this.settings$.next(this.settings);

      console.log('update response', response);
      return response;
    } catch (e) {
      console.log('update error');

      console.error(e);
      return e;
    }
  }
}

import { Injectable, Output, EventEmitter } from '@angular/core';
import { Client } from '../../common/api/client.service';
import { Session } from '../../services/session';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SettingsV2Service {
  settings: any = {
    name: '',
  };
  proSettings: any = {};
  settings$: BehaviorSubject<any> = new BehaviorSubject(this.settings);
  proSettings$: BehaviorSubject<any> = new BehaviorSubject(this.proSettings);

  constructor(
    private client: Client,
    protected session: Session
  ) {}

  async loadSettings(guid): Promise<any> {
    try {
      const { channel } = <any>await this.client.get('api/v1/settings/' + guid);

      this.settings = { ...channel };

      this.settings$.next(this.settings);

      return channel;
    } catch (e) {
      console.error(e);
      return e;
    }
  }

  async updateSettings(guid, form): Promise<any> {
    try {
      const response = <any>(
        await this.client.post('api/v1/settings/' + guid, form)
      );

      // Refresh settings$ after updates are made
      this.loadSettings(guid);
      return response;
    } catch (e) {
      console.error(e);
      return e;
    }
  }

  async showBoost(): Promise<void> {
    if (this.session.getLoggedInUser().plus) {
      try {
        await this.client.delete('api/v1/plus/boost');
      } catch (e) {
        console.error(e);
      }
    }
  }

  async hideBoost(): Promise<void> {
    if (this.session.getLoggedInUser().plus) {
      try {
        await this.client.put('api/v1/plus/boost');
      } catch (e) {
        console.error(e);
      }
    }
  }
}

import { Component } from '@angular/core';

import { Client } from '../../../../services/api';

@Component({
  moduleId: module.id,
  templateUrl: 'settings.component.html',
  selector: 'm-wallet-ad-sharing-settings',
})
export class AdSharingSettingsComponent {
  inProgress: boolean = false;
  loaded: boolean = false;
  settings = {
    blogs: false
  }

  constructor(private client: Client) { }

  ngOnInit() {
    this.load();
  }

  load() {
    this.inProgress = true;

    return this.client.get(`api/v1/monetization/ads/settings`)
      .then((response: any) => {
        this.inProgress = false;
        this.loaded = true;

        this.settings = response.settings;
      })
      .catch(e => {
        this.inProgress = false;
      });
  }

  save(key: string) {
    return this.client.post(`api/v1/monetization/ads/settings`, { [key]: this.settings[key] ? 1 : 0 })
      .then((response: any) => {
      })
      .catch(e => {
      });
  }
}

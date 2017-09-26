import { Component } from '@angular/core';

import { Client } from '../../../services/api';

@Component({
  moduleId: module.id,
  selector: 'minds-settings-statistics',
  inputs: ['object'],
  templateUrl: 'statistics.html',
})

export class SettingsStatistics {

  minds: Minds;
  user: any;
  settings: string;
  data = {
    fullname: 'minds',
    email: 'minds@minds.com',
    memberSince: new Date(),
    lastLogin: new Date(),
    storage: '0 GB\'s',
    bandwidth: '0 GB\'s',
    referrals: 500,
    earnings: 123123

  };
  constructor(public client: Client) {
    this.minds = window.Minds;
    this.minds.cdn_url = 'https://d3ae0shxev0cb7.cloudfront.net';
  }

}

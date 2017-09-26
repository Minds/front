import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Client } from '../../../services/api';


@Component({
  moduleId: module.id,
  selector: 'minds-settings-disable-channel',
  inputs: ['object'],
  templateUrl: 'disable.html'
})

export class SettingsDisableChannel {

  minds: Minds;
  user: any;
  settings: string;
  object: any;

  constructor(public client: Client, public router: Router) {
    this.minds = window.Minds;
  }

  disable() {
    this.client.delete('api/v1/channel')
      .then((response: any) => {
        this.router.navigate(['/logout']);
      })
      .catch((e: any) => {
        alert('Sorry, we could not disable your account');
      });
  }

}

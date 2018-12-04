import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Navigation as NavigationService } from '../../services/navigation';
import { Session } from '../../services/session';
import { MindsTitle } from '../../services/ux/title';
import { Client } from '../../services/api';
import { LoginReferrerService } from '../../services/login-referrer.service';

@Component({
  selector: 'm-hours',
  templateUrl: 'hours.component.html'
})

export class HoursComponent {
  minds;
  seconds: number = 0;


  constructor(
    public client: Client,
    public title: MindsTitle,
  ) {
  }

  private timeout;

  ngOnInit() {
    this.minds = window.Minds;
    this.title.setTitle('How many hours');
    this.getHowManyHours();
  }

  async getHowManyHours() {
    clearTimeout(this.timeout);

    try {
      //Could just use this.minds.user.time_created 
      //But we're fetching data async from the api.
      const response: any = await this.client.get(`api/v2/hours`);
      let nowSecs = Math.floor(new Date().getTime() / 1000);
      this.seconds = nowSecs - parseInt(response.seconds);
      this.startCounter();
    } catch (e) {
        console.error(e);
    }
  }

  startCounter() {
    this.timeout = setTimeout(() => {
      this.seconds += 1;
      this.startCounter();
    }, 1000);
  }

}
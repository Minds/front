import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'm-onboarding__channelsStep',
  templateUrl: 'channels.component.html',
})
export class ChannelsStepComponent {
  constructor(private router: Router) {}

  finish() {
    this.router.navigate(['/newsfeed/global/top']);
  }
}

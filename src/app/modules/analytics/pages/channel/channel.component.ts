import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Session } from '../../../../services/session';

@Component({
  selector: 'm-analytics__channel',
  templateUrl: 'channel.component.html',
})
export class ChannelAnalyticsComponent {
  constructor(private router: Router, private session: Session) {}

  ngOnInit() {
    if (!this.session.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
  }
}

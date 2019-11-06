import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MindsTitle } from '../../services/ux/title';
import { Session } from '../../services/session';
import { Client } from '../../services/api';

@Component({
  selector: 'm-canary',
  templateUrl: 'page.component.html',
})
export class CanaryPageComponent {
  minds = window.Minds;
  user;

  constructor(
    private title: MindsTitle,
    private session: Session,
    private client: Client,
    private router: Router
  ) {
    this.title.setTitle('Canary - Experiments');
  }

  ngOnInit() {
    this.user = this.session.getLoggedInUser();
    this.load();
  }

  async load() {
    if (!this.user) return;
    let response: any = await this.client.get('api/v2/canary');
    this.user.canary = response.enabled;
  }

  async turnOn() {
    if (!this.user) return this.router.navigate(['/login']);

    this.user.canary = true;
    await this.client.put('api/v2/canary');
    window.location.reload();
  }

  async turnOff() {
    this.user.canary = false;
    await this.client.delete('api/v2/canary');

    window.location.reload();
  }
}

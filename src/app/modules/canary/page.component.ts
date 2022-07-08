import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Session } from '../../services/session';
import { Client } from '../../services/api';
import { storageMock } from '../../../tests/storage-mock.spec';
import { Storage } from '../../services/storage';
import { ToasterService } from '../../common/services/toaster.service';

@Component({
  selector: 'm-canary',
  templateUrl: 'page.component.html',
  styleUrls: [
    './page.component.ng.scss',
    '../aux-pages/aux-pages.component.ng.scss',
  ],
})
export class CanaryPageComponent {
  user;
  buttonHovering: boolean = false;
  inProgress: boolean = false;

  constructor(
    private session: Session,
    private client: Client,
    private router: Router,
    private storage: Storage,
    private toasterService: ToasterService
  ) {}

  ngOnInit() {
    this.user = this.session.getLoggedInUser();
    this.load();
  }

  async load() {
    if (!this.user) return;
    let response: any = await this.client.get('api/v2/canary');
    this.user.canary = response.enabled;

    if (this.storage.get('canary_toast')) {
      const message =
        this.storage.get('canary_toast') === 'on'
          ? 'Welcome to Canary! You will now receive the latest Minds features before everyone else'
          : 'Canary successfully disabled';
      this.toasterService.success(message);
      this.storage.destroy('canary_toast');
    }
  }

  async turnOn() {
    if (!this.user) return this.router.navigate(['/login']);
    this.inProgress = true;
    this.user.canary = true;
    await this.client.put('api/v2/canary');

    this.storage.set('canary_toast', 'on');

    window.location.reload();
  }

  async turnOff() {
    this.user.canary = false;
    this.inProgress = true;
    await this.client.delete('api/v2/canary');

    this.storage.set('canary_toast', 'off');

    window.location.reload();
  }
}

import { Component, HostBinding, Input } from '@angular/core';
import { Session } from '../../../services/session';
import { Router } from '@angular/router';
import { Storage } from '../../../services/storage';

@Component({
  selector: 'm-channel--explicit-overlay',
  templateUrl: 'overlay.component.html'
})

export class ExplicitOverlayComponent {
  @HostBinding('hidden') hidden: boolean;
  _channel: any;

  @Input() set channel(value: any) {
    this._channel = value;

    this.hidden = !this._channel || !this._channel.is_mature || this._channel.mature_visibility;
  }

  constructor(
    public session: Session,
    public storage: Storage,
    public router: Router
  ) {

  }

  login() {
    this.storage.set('redirectTo', window.Minds.site_url + this._channel.username);
    this.router.navigate(['/login']);
  }

  disableFilter() {
    this._channel.mature_visibility = true;
    this.hidden = true;
  }
}
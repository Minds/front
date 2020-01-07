import { Component, Input } from '@angular/core';
import { Session } from '../../../services/session';
import { Router } from '@angular/router';
import { Storage } from '../../../services/storage';

@Component({
  selector: 'm-channel--explicit-overlay',
  templateUrl: 'overlay.component.html',
})
export class ExplicitOverlayComponent {
  public hidden = true;
  public _channel: any;

  @Input() set channel(value: any) {
    this._channel = value;
    this.showOverlay();
  }

  constructor(
    public session: Session,
    public storage: Storage,
    public router: Router
  ) {}

  login() {
    this.storage.set(
      'redirect',
      window.Minds.site_url + this._channel.username
    );
    this.router.navigate(['/login']);
  }

  /**
   * Disables overlay screen, revealing channel.
   */
  protected disableFilter(): void {
    this._channel.mature_visibility = true;
    this.hidden = true;
  }

  /**
   * Determines whether the channel overlay should be shown
   * over the a channel.
   */
  public showOverlay(): void {
    if (!this._channel) {
      return;
    }

    if (this._channel.mature_visibility) {
      this.hidden = true;
    } else if (this._channel.is_mature) {
      this.hidden = false;
    } else if (this._channel.nsfw && this._channel.nsfw.length > 0) {
      this.hidden = false;
    } else {
      this.hidden = true;
    }
  }
}

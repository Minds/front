import { Component, Input } from '@angular/core';
import { Session } from '../../../services/session';
import { Router } from '@angular/router';
import { Storage } from '../../../services/storage';
import { ConfigsService } from '../../services/configs.service';

@Component({
  selector: 'm-explicit-overlay',
  templateUrl: 'overlay.component.html',
})
export class ExplicitOverlayComponent {
  readonly siteUrl: string;
  public hidden = true;
  public _entity: any;
  public type: string;

  @Input() set entity(value: any) {
    if (value) {
      // change wording for entity label
      this.type = value.type === 'user' ? 'channel' : value.type;

      this._entity = value;
      this.showOverlay();
    }
  }

  @Input() message: string;

  constructor(
    public session: Session,
    public storage: Storage,
    public router: Router,
    configs: ConfigsService
  ) {
    this.siteUrl = configs.get('site_url');
  }

  login() {
    // TODO: Support redirect for other entity types.
    if (this.type === 'channel') {
      this.storage.set('redirect', this.siteUrl + this._entity.username);
      this.router.navigate(['/login']);
    }
  }

  /**
   * Disables overlay screen, revealing channel.
   */
  protected disableFilter(): void {
    this._entity.mature_visibility = true;
    this.hidden = true;
  }

  /**
   * Determines whether the channel overlay should be shown
   * over the a channel.
   */
  public showOverlay(): void {
    if (!this._entity) {
      return;
    }

    if (this._entity.mature_visibility) {
      this.hidden = true;
    } else if (this._entity.is_mature) {
      this.hidden = false;
    } else if (this._entity.nsfw && this._entity.nsfw.length > 0) {
      this.hidden = false;
    } else if (this._entity.nsfw_lock && this._entity.nsfw_lock.length > 0) {
      this.hidden = false;
    } else {
      this.hidden = true;
    }
  }
}

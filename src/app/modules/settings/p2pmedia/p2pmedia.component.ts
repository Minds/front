import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { Storage } from '../../../services/storage';
import { WebtorrentService } from '../../webtorrent/webtorrent.service';
import { Client } from '../../../services/api/client';
import { Session } from '../../../services/session';

@Component({
  selector: 'm-settings--p2pmedia',
  templateUrl: 'p2pmedia.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsP2PMediaComponent {
  settings = {
    enableP2p: false,
  };

  supported: boolean = true;
  changed: boolean = false;

  constructor(
    protected cd: ChangeDetectorRef,
    protected storage: Storage,
    protected webtorrent: WebtorrentService,
    protected client: Client,
    private session: Session
  ) {}

  ngOnInit() {
    this.supported = this.webtorrent.isBrowserSupported();
    this.settings.enableP2p = this.session.getLoggedInUser().p2p_media_enabled;
  }

  change() {
    this.changed = true;
  }

  async save() {
    this.session.getLoggedInUser().p2p_media_enabled = this.settings.enableP2p;
    this.webtorrent.setEnabled(!this.settings.enableP2p);

    const url = 'api/v2/settings/p2p';

    try {
      if (this.settings.enableP2p) {
        await this.client.post(url);
      } else {
        await this.client.delete(url);
      }
    } catch (e) {
      this.session.getLoggedInUser().p2p_media_enabled = this.settings.enableP2p;
      this.webtorrent.setEnabled(this.settings.enableP2p);
    }

    this.changed = false;
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}

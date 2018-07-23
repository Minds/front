import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Storage } from '../../../services/storage';
import { WebtorrentService } from '../../webtorrent/webtorrent.service';
import { Client } from '../../../services/api/client';

@Component({
  moduleId: module.id,
  selector: 'm-settings--p2pmedia',
  templateUrl: 'p2pmedia.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsP2PMediaComponent {
  settings = {
    disableP2p: false,
  };

  supported: boolean = true;
  changed: boolean = false;

  constructor(
    protected cd: ChangeDetectorRef,
    protected storage: Storage,
    protected webtorrent: WebtorrentService,
    protected client: Client,
  ) {}

  ngOnInit() {
    this.supported = this.webtorrent.isBrowserSupported();
    this.settings.disableP2p = !this.webtorrent.isEnabled();
  }

  change() {
    this.changed = true;
  }

  async save() {
    window.Minds.user.p2p_media_disabled = this.settings.disableP2p;
    this.webtorrent.setEnabled(!this.settings.disableP2p);

    const url = 'api/v2/settings/p2p';

    try {
      if (this.settings.disableP2p) {
        await this.client.post(url);

      } else {
        await this.client.delete(url);
      }
    } catch (e) {
      window.Minds.user.p2p_media_disabled = this.settings.disableP2p;
      this.webtorrent.setEnabled(this.settings.disableP2p);
    }

    this.changed = false;
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}

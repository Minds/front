import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Storage } from '../../../services/storage';
import { WebtorrentService } from '../../webtorrent/webtorrent.service';

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

  changed: boolean = false;

  constructor(
    protected cd: ChangeDetectorRef,
    protected storage: Storage,
    protected webtorrent: WebtorrentService,
  ) {}

  ngOnInit() {
    this.settings.disableP2p = !this.webtorrent.isEnabled();
  }

  change() {
    this.changed = true;
  }

  save() {
    this.webtorrent.setEnabled(!this.settings.disableP2p);
    this.changed = false;
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}

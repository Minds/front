import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { YoutubeMigrationService } from '../youtube-migration.service';
import { OverlayModalService } from '../../../../services/ux/overlay-modal';

@Component({
  selector: 'm-youtubeMigration__setupModal',
  templateUrl: './setup-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YoutubeMigrationSetupModalComponent implements OnInit {
  @Output() dismissModal: EventEmitter<any> = new EventEmitter();
  activeChannel: any;
  inProgress: boolean = false;

  constructor(
    protected youtubeService: YoutubeMigrationService,
    protected overlayModal: OverlayModalService,
    protected cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // TODOOJM getChannels isn't returning anything
    // this.getChannel();
  }

  /**
   * Select the channel that has been connected the most recently
   */
  getChannel() {
    const channels = this.youtubeService.getChannels();
    console.log(channels);
    let activeChannel,
      mostRecentConnectedTimestamp = 0;

    channels.forEach(c => {
      if (c.connected > mostRecentConnectedTimestamp) {
        mostRecentConnectedTimestamp = c.connected;
        activeChannel = c;
      }
    });

    this.activeChannel = activeChannel;
    this.youtubeService.selectChannel(this.activeChannel.id);
    this.detectChanges();
    console.log(this.activeChannel);
  }

  enableAutoImport() {
    this.inProgress = true;
    this.detectChanges();
    this.youtubeService.enableAutoImport();
    this.overlayModal.dismiss();
  }

  disableAutoImport() {
    this.inProgress = true;
    this.detectChanges();
    this.youtubeService.disableAutoImport();
    this.overlayModal.dismiss();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}

import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import {
  YoutubeMigrationService,
  YoutubeChannel,
} from '../youtube-migration.service';
import { Session } from '../../../../services/session';
import { ConfigsService } from '../../../../common/services/configs.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'm-youtubeMigration__transferStatus',
  templateUrl: './transfer-status.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YoutubeMigrationTransferStatusComponent
  implements OnInit, OnDestroy {
  constructor(
    protected youtubeService: YoutubeMigrationService,
    protected session: Session,
    protected cd: ChangeDetectorRef,
    configs: ConfigsService
  ) {
    this.dailyLimit = configs.get('max_daily_imports') || 10;
  }

  dailyLimit: number;
  selectedChannelSubscription: Subscription;
  selectedChannel: YoutubeChannel;
  queuedCount: number = 0;
  transferringCount: number = 0;
  unmigratedVideos: any = [];
  unmigratedVideosSubscription: Subscription;

  ngOnInit() {
    this.selectedChannelSubscription = this.youtubeService.selectedChannel$.subscribe(
      channel => {
        this.selectedChannel = channel;
        this.detectChanges();
      }
    );

    this.unmigratedVideosSubscription = this.youtubeService.unmigratedVideos$.subscribe(
      unmigratedVideos => {
        this.unmigratedVideos = unmigratedVideos;
        this.getCounts();
        this.detectChanges();
      }
    );
  }

  ngOnDestroy() {
    this.unmigratedVideosSubscription.unsubscribe();
    this.selectedChannelSubscription.unsubscribe();
  }

  getCounts(): void {
    this.queuedCount = this.unmigratedVideos.filter(
      v => v.status === 'queued'
    ).length;
    this.transferringCount = this.unmigratedVideos.filter(
      v => v.status === 'transferring'
    ).length;
    this.detectChanges();
  }

  async transferAllVideos(): Promise<any> {
    this.youtubeService.import(this.selectedChannel.id, 'all');
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}

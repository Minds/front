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
  statusCountsSubscription: Subscription;
  queuedCount: number = 0;
  transferringCount: number = 0;
  init: boolean = false;

  ngOnInit() {
    // Initialize statusCounts$
    this.youtubeService.getStatusCounts();

    this.statusCountsSubscription = this.youtubeService.statusCounts$.subscribe(
      counts => {
        this.queuedCount = counts.queued;
        this.transferringCount = counts.transferring;
        this.init = true;
        this.detectChanges();
      }
    );
  }

  ngOnDestroy() {
    this.statusCountsSubscription.unsubscribe();
  }

  async transferAllVideos(): Promise<any> {
    this.youtubeService.import('all');
    this.youtubeService.getStatusCounts();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}

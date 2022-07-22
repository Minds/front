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
  YoutubeStatusCounts,
} from '../youtube-migration.service';
import { Session } from '../../../../services/session';
import { ConfigsService } from '../../../../common/services/configs.service';
import { Subscription, timer } from 'rxjs';
import { ToasterService } from '../../../../common/services/toaster.service';

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
    configs: ConfigsService,
    protected toasterService: ToasterService
  ) {
    this.dailyLimit = configs.get('max_daily_imports') || 10;
  }

  dailyLimit: number;
  statusCountsSubscription: Subscription;
  statusInterval: Subscription;
  counts: YoutubeStatusCounts = {
    queued: 0,
    transferring: 0,
  };
  transferringAll: boolean = false;
  importingAllVideos$ = this.youtubeService.importingAllVideos$;
  init: boolean = false;

  ngOnInit() {
    // Initialize statusCounts$
    this.youtubeService.getStatusCounts();

    this.statusCountsSubscription = this.youtubeService.statusCounts$.subscribe(
      counts => {
        this.counts = counts;
        this.init = true;
        this.detectChanges();
      }
    );

    // We check every 5 seconds
    // this.statusInterval = timer(0, 5000).subscribe(() => {
    //   this.youtubeService.getStatusCounts();
    // });
  }

  ngOnDestroy() {
    this.statusCountsSubscription.unsubscribe();
    //this.statusInterval.unsubscribe();
  }

  async transferAllVideos(): Promise<any> {
    try {
      this.transferringAll = true;
      this.youtubeService.statusCounts$.next({
        queued: this.dailyLimit,
        transferring: this.counts.transferring,
      });
      this.detectChanges();
      await this.youtubeService.import('all');
    } catch (err) {
      this.toasterService.error(
        'Sorry, there was an error transferring your videos'
      );
      this.youtubeService.statusCounts$.next({
        queued: 0,
        transferring: this.counts.transferring,
      });
    } finally {
      this.transferringAll = false;
      this.detectChanges();
    }
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}

import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { YoutubeMigrationService } from '../youtube-migration.service';
import { Session } from '../../../../services/session';
import * as moment from 'moment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'm-youtubeMigration__unmigratedVideos',
  templateUrl: './unmigrated-videos.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YoutubeMigrationUnmigratedVideosComponent
  implements OnInit, OnDestroy {
  init: boolean = false;
  inProgress: boolean = false;
  videos: any = [];
  unmigratedVideosSubscription: Subscription;

  constructor(
    protected youtubeService: YoutubeMigrationService,
    protected session: Session,
    protected cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.unmigratedVideosSubscription = this.youtubeService.unmigratedVideos$.subscribe(
      unmigratedVideos => {
        this.videos = unmigratedVideos;
        this.formatVideos();

        this.detectChanges();
      }
    );
  }

  ngOnDestroy() {
    this.unmigratedVideosSubscription.unsubscribe();
  }

  formatVideos() {
    this.videos.forEach(v => {
      const durationFormat = v.duration >= 3600 ? 'H:mm:ss' : 'mm:ss';
      v.friendlyDuration = moment
        .utc(moment.duration(Number(v.duration), 'seconds').asMilliseconds())
        .format(durationFormat);

      v.friendlyDate = moment(v.youtubeCreationDate, 'X').format('MMM Do YYYY');
    });
  }

  cancel(channelId, videoId) {
    this.youtubeService.cancelImport(channelId, videoId);
  }

  import(channelId, videoId) {
    this.youtubeService.import(channelId, videoId);
  }

  openYoutubeWindow(url: string): void {
    window.open(url, '_blank');
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}

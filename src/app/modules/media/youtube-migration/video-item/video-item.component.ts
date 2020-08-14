import {
  Component,
  Input,
  ChangeDetectorRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { YoutubeMigrationService } from '../youtube-migration.service';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'm-youtubeMigration__videoItem',
  templateUrl: './video-item.component.html',
  styleUrls: ['./video-item.component.ng.scss'],
})
export class YoutubeMigrationVideoItemComponent {
  @Input() video;
  @Output() requestPlay: EventEmitter<any> = new EventEmitter();

  statusPolling: Subscription;

  constructor(
    protected youtubeService: YoutubeMigrationService,
    protected cd: ChangeDetectorRef
  ) {}

  playRequested(): void {
    this.requestPlay.emit({ video: this.video });
  }

  cancel(): void {
    const videoId = this.video.video_id;
    this.youtubeService.cancelImport(videoId);
    this.video.status = null;

    if (this.statusPolling) this.statusPolling.unsubscribe();
  }

  import(): void {
    const videoId = this.video.video_id;
    this.youtubeService.import(videoId);
    this.video.status = 'queued';

    // Poll every 10 seconds, in 5 seconds time
    this.statusPolling = timer(5000, 10000).subscribe(async () => {
      const status = await this.youtubeService.getVideoStatus(videoId);

      if (status) {
        if (status === 'completed') {
          this.statusPolling.unsubscribe();
        }
        this.video.status = status;
        this.detectChange();
      }
    });
  }

  ngOnDestroy() {
    if (this.statusPolling) this.statusPolling.unsubscribe();
  }

  detectChange(): void {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}

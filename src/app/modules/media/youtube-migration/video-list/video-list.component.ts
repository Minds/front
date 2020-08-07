import { Component, Input, Output, EventEmitter } from '@angular/core';
import { YoutubeMigrationService } from '../youtube-migration.service';

@Component({
  selector: 'm-youtubeMigration__videoList',
  templateUrl: './video-list.component.html',
})
export class YoutubeMigrationVideoListComponent {
  @Input() videos: any;
  @Output() requestPlay: EventEmitter<any> = new EventEmitter();

  constructor(protected youtubeService: YoutubeMigrationService) {}

  playRequested(video: any): void {
    this.requestPlay.emit({ video: video });
  }

  cancel(video: any): void {
    const videoId = video.video_id;
    this.youtubeService.cancelImport(videoId);
    // video.status = this.youtubeService.getVideoStatus(videoId);
    video.status = null;
  }

  import(video: any): void {
    const videoId = video.video_id;
    this.youtubeService.import(videoId);
    // video.status = this.youtubeService.getVideoStatus(videoId);
    video.status = 'transcoding';
  }
}

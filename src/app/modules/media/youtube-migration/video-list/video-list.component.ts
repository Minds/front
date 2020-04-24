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

  clickedVideo(video: any): void {
    this.requestPlay.emit({ video: video });
  }

  cancel(channelId, videoId) {
    this.youtubeService.cancelImport(channelId, videoId);
  }

  import(channelId, videoId) {
    this.youtubeService.import(channelId, videoId);
  }
}

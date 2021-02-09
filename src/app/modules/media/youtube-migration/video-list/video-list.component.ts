import { Component, Input, Output, EventEmitter } from '@angular/core';
import { YoutubeMigrationService } from '../youtube-migration.service';

@Component({
  selector: 'm-youtubeMigration__videoList',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.ng.scss'],
})
export class YoutubeMigrationVideoListComponent {
  @Input() videos: any;
  @Output() requestPlay: EventEmitter<any> = new EventEmitter();

  constructor(protected youtubeService: YoutubeMigrationService) {}

  playRequested(e): void {
    this.requestPlay.emit({ video: e.video });
  }
}

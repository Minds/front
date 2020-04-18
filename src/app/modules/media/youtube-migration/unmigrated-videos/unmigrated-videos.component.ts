import { Component, OnInit } from '@angular/core';
import { YoutubeMigrationService } from '../youtube-migration.service';

@Component({
  selector: 'm-youtubeMigration__unmigratedVideos',
  templateUrl: './unmigrated-videos.component.html',
})
export class YoutubeMigrationUnmigratedVideosComponent implements OnInit {
  constructor(protected youtubeService: YoutubeMigrationService) {}

  ngOnInit() {}
}

import { Component, OnInit } from '@angular/core';
import { YoutubeMigrationService } from '../youtube-migration.service';
import { Session } from '../../../../services/session';
import { Router } from '@angular/router';

@Component({
  selector: 'm-youtubeMigration__connect',
  templateUrl: './connect.component.html',
})
export class YoutubeMigrationConnectComponent implements OnInit {
  constructor(
    protected session: Session,
    protected youtubeService: YoutubeMigrationService,
    public router: Router
  ) {}

  inProgress: boolean = false;

  ngOnInit() {}

  async connect(): Promise<void> {
    const { url } = (await this.youtubeService.requestAuthorization()) as any;

    if (url) {
      window.location.replace(url);
    }
  }
}

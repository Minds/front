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

  ngOnInit() {
    const user = this.session.getLoggedInUser();
    console.log(user);
    if (user.yt_channels) {
      this.router.navigate(['dashboard'], { replaceUrl: true });
      return;
    }
  }

  async connect() {
    this.inProgress = true;
    this.youtubeService.requestAuthorization();
  }
}

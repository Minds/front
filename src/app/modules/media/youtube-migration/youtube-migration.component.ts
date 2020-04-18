import { Component, OnInit } from '@angular/core';
import { YoutubeMigrationService } from './youtube-migration.service';
import { Session } from '../../../services/session';
import { Router } from '@angular/router';

@Component({
  selector: 'm-youtubeMigration',
  templateUrl: './youtube-migration.component.html',
})
export class YoutubeMigrationComponent implements OnInit {
  constructor(
    protected youtubeService: YoutubeMigrationService,
    protected session: Session,
    protected router: Router
  ) {}

  ngOnInit() {
    const user = this.session.getLoggedInUser();
    if (!user.yt_channels || user.yt_channels.length > 1) {
      this.router.navigate(['/connect'], { replaceUrl: true });
      return;
    } else {
      this.router.navigate(['/dashboard'], { replaceUrl: true });
      return;
    }
  }
}

import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewRef,
} from '@angular/core';
import { YoutubeMigrationService } from '../youtube-migration.service';
import { Router } from '@angular/router';

@Component({
  selector: 'm-youtubeMigration__connect',
  templateUrl: './connect.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YoutubeMigrationConnectComponent {
  constructor(
    protected youtubeService: YoutubeMigrationService,
    public router: Router,
    protected cd: ChangeDetectorRef
  ) {}

  inProgress: boolean = false;

  async connect(): Promise<void> {
    this.inProgress = true;
    this.detectChanges();
    const { url } = (await this.youtubeService.connectAccount()) as any;

    if (url) {
      window.location.replace(url);
    }
  }

  detectChanges() {
    if (!(this.cd as ViewRef).destroyed) {
      this.cd.markForCheck();
      this.cd.detectChanges();
    }
  }
}

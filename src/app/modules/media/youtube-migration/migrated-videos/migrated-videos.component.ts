import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { OverlayModalService } from '../../../../services/ux/overlay-modal';
import { MediaModalComponent } from '../../../media/modal/modal.component';
import { Router } from '@angular/router';
import { YoutubeMigrationService } from '../youtube-migration.service';
import { Session } from '../../../../services/session';
import { Subscription } from 'rxjs';

@Component({
  selector: 'm-youtubeMigration__migratedVideos',
  templateUrl: './migrated-videos.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YoutubeMigrationMigratedVideosComponent implements OnInit {
  init: boolean = false;
  videos: any = [];
  nextPageToken: string = '';
  moreData = true;
  inProgress = false;

  constructor(
    protected youtubeService: YoutubeMigrationService,
    protected session: Session,
    protected cd: ChangeDetectorRef,
    protected overlayModal: OverlayModalService,
    protected router: Router
  ) {}

  ngOnInit() {
    this.load(true);
    this.init = true;
    this.detectChanges();
  }

  async load(refresh: boolean = false) {
    if (this.inProgress) {
      return;
    }
    this.inProgress = true;

    if (refresh) {
      this.videos = [];
      this.moreData = true;
    }

    try {
      const response = <any>(
        await this.youtubeService.getVideos(null, this.nextPageToken)
      );

      if (!response.videos.length) {
        this.inProgress = false;
        this.moreData = false;
        this.detectChanges();
        return;
      }

      if (response['nextPageToken']) {
        this.nextPageToken = response['nextPageToken'];
      } else {
        this.moreData = false;
      }

      this.videos.push(...response.videos);
      this.inProgress = false;
      this.detectChanges();
    } catch (e) {
      this.moreData = false;
      this.inProgress = false;
      this.detectChanges();
      console.error(e);
    }
  }

  // TODO: consider refactoring bc it is duplicated
  onModalRequested($event): void {
    const entity = $event.video.entity;
    if (!this.overlayModal.canOpenInModal()) {
      return;
    }

    entity.modal_source_url = this.router.url;

    this.overlayModal
      .create(
        MediaModalComponent,
        { entity: entity },
        {
          class: 'm-overlayModal--media',
        }
      )
      .present();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}

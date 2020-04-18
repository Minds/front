import { Component, OnInit } from '@angular/core';
import { OverlayModalService } from '../../../../services/ux/overlay-modal';
import { MediaModalComponent } from '../../../media/modal/modal.component';
import { Router } from '@angular/router';
import { YoutubeMigrationService } from '../youtube-migration.service';

@Component({
  selector: 'm-youtubeMigration__migratedVideos',
  templateUrl: './migrated-videos.component.html',
})
export class YoutubeMigrationMigratedVideosComponent implements OnInit {
  constructor(
    private overlayModal: OverlayModalService,
    private router: Router,
    protected youtubeService: YoutubeMigrationService
  ) {}

  ngOnInit() {}

  onModalRequested(event: MouseEvent, entity) {
    if (!this.overlayModal.canOpenInModal()) {
      return;
    }

    if (event) {
      event.preventDefault();
      event.stopPropagation();
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
}

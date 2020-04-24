import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
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
export class YoutubeMigrationMigratedVideosComponent
  implements OnInit, OnDestroy {
  init: boolean = false;
  inProgress: boolean = false;
  videos: any = [];
  migratedVideosSubscription: Subscription;

  constructor(
    protected youtubeService: YoutubeMigrationService,
    protected session: Session,
    protected cd: ChangeDetectorRef,
    protected overlayModal: OverlayModalService,
    protected router: Router
  ) {}

  ngOnInit() {
    this.migratedVideosSubscription = this.youtubeService.migratedVideos$.subscribe(
      migratedVideos => {
        this.videos = migratedVideos;
        this.init = true;
        this.detectChanges();
      }
    );
  }

  ngOnDestroy() {
    this.migratedVideosSubscription.unsubscribe();
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

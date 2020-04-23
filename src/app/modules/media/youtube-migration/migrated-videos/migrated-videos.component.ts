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
import * as moment from 'moment';

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
        this.formatVideos();
        this.init = true;
        this.detectChanges();
      }
    );
  }

  ngOnDestroy() {
    this.migratedVideosSubscription.unsubscribe();
  }

  formatVideos(): void {
    this.videos.forEach(v => {
      const durationFormat = v.duration >= 3600 ? 'H:mm:ss' : 'mm:ss';
      v.friendlyDuration = moment
        .utc(moment.duration(Number(v.duration), 'seconds').asMilliseconds())
        .format(durationFormat);

      v.friendlyDate = moment(v.entity.time_created, 'X').format('MMM Do YYYY');
    });
  }

  onModalRequested(event: MouseEvent, entity): void {
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

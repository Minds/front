import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
  Injector,
  SkipSelf,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { YoutubeMigrationService } from '../youtube-migration.service';
import { Session } from '../../../../services/session';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { OverlayModalService } from '../../../../services/ux/overlay-modal';
import { YoutubeMigrationSetupModalComponent } from '../setup-modal/setup-modal.component';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'm-youtubeMigration__unmigratedVideos',
  templateUrl: './unmigrated-videos.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YoutubeMigrationUnmigratedVideosComponent
  implements OnInit, OnDestroy {
  @SkipSelf() private injector: Injector;

  init: boolean = false;
  videos: any = [];
  nextPageToken: string = '';
  moreData = true;
  inProgress = false;
  importingAllVideosSubscription: Subscription;

  constructor(
    protected youtubeService: YoutubeMigrationService,
    protected session: Session,
    protected route: ActivatedRoute,
    protected overlayModal: OverlayModalService,
    protected cd: ChangeDetectorRef // @Inject(PLATFORM_ID) protected platformId: Object
  ) {}

  ngOnInit() {
    // TODOOJM remove this
    // this.openSetupModal();

    this.load(true);

    this.route.queryParamMap.subscribe(params => {
      if (params.get('status') === 'setup') {
        this.openSetupModal();
      }
    });

    this.importingAllVideosSubscription = this.youtubeService.importingAllVideos$.subscribe(
      importing => {
        if (importing) {
          // Refresh the video list when user clicks 'transfer all'
          // so video transfer statuses are visually updated
          this.init = false;
          this.detectChanges();
          this.load(false);
          this.init = true;
        }
      }
    );
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

  openYoutubeWindow($event): void {
    const url: string = $event.video.url;
    window.open(url, '_blank');
  }

  openSetupModal(): void {
    this.overlayModal
      .create(
        YoutubeMigrationSetupModalComponent,
        null,
        {
          wrapperClass: 'm-modalV2__wrapper',
        },
        this.injector
      )
      .present();
  }

  ngOnDestroy() {
    if (this.importingAllVideosSubscription) {
      this.importingAllVideosSubscription.unsubscribe();
    }
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}

import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
  Injector,
  SkipSelf,
} from '@angular/core';
import { YoutubeMigrationService } from '../youtube-migration.service';
import { Session } from '../../../../services/session';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { OverlayModalService } from '../../../../services/ux/overlay-modal';
import { YoutubeMigrationSetupModalComponent } from '../setup-modal/setup-modal.component';

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
  nextPageToken: string | null = null;
  moreData = true;
  inProgress = false;
  limit = 12;
  fewerResultsThanLimit = true;
  noInitResults = false;

  importingAllVideosSubscription: Subscription;

  constructor(
    protected youtubeService: YoutubeMigrationService,
    protected session: Session,
    protected route: ActivatedRoute,
    protected overlayModal: OverlayModalService,
    protected cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
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
          this.load(true);
          this.init = true;
        }
      }
    );
    this.init = true;
    this.detectChanges();
  }

  async load(refresh: boolean = false) {
    const limit = 12;
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

      // Hide infinite scroll's 'nothing more to load' notice
      // if initial load length is less than response limit
      if (refresh && response.videos.length < limit) {
        this.fewerResultsThanLimit = true;
        //this.moreData = false;
      } else {
        this.fewerResultsThanLimit = false;
      }

      if (!response.videos.length) {
        this.inProgress = false;
        this.moreData = false;

        // If no results on initial load, show notice instead of empty table
        if (refresh) {
          this.noInitResults = true;
          this.detectChanges();
          return;
        }

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
    const url: string = $event.video.youtubeUrl;
    window.open(url, '_blank');
  }

  openSetupModal(): void {
    this.overlayModal
      .create(
        YoutubeMigrationSetupModalComponent,
        null,
        {
          class: 'm-overlay-modal--medium',
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
